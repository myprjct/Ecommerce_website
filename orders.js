const express = require('express');
const { Order, OrderItem, Product } = require('../models');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [OrderItem]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items } = req.body; // items should be array of { productId, quantity }
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // Calculate total and prepare order items
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      
      const price = product.price;
      totalAmount += price * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: price
      });
    }

    // Create the order
    const order = await Order.create({
      userId: req.userId,
      totalAmount,
      status: 'completed' // auto complete for simplicity
    });

    // Create order items
    for (let itemData of orderItemsData) {
      itemData.orderId = order.id;
      await OrderItem.create(itemData);
    }

    res.status(201).json({ message: 'Order created successfully', orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
