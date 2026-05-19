// Checkout Logic
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to proceed with checkout.');
    window.location.href = '/login.html';
    return;
  }

  const summaryContainer = document.getElementById('checkout-summary');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const msg = document.getElementById('checkout-message');

  if (cart.length === 0) {
    summaryContainer.innerHTML = '<p>Your cart is empty. Please add items to checkout.</p>';
    placeOrderBtn.style.display = 'none';
    return;
  }

  let total = 0;
  let summaryHTML = '<h3>Order Summary</h3><ul style="list-style: none; padding: 0; margin-top: 1rem;">';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    summaryHTML += `
      <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 0.5rem 0;">
        <span>${item.name} (x${item.quantity})</span>
        <span>$${itemTotal.toFixed(2)}</span>
      </li>
    `;
  });

  summaryHTML += `
    <li style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; padding-top: 1rem;">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </li></ul>
  `;
  
  summaryContainer.innerHTML = summaryHTML;

  placeOrderBtn.addEventListener('click', async () => {
    const orderItems = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
    
    try {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = 'Processing...';

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderItems })
      });

      const data = await res.json();
      
      if (res.ok) {
        // Clear cart
        localStorage.removeItem('cart');
        cart = [];
        updateCartCount();
        
        msg.style.display = 'block';
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        alert(data.error || 'Failed to place order.');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
      }
    } catch (err) {
      alert('An error occurred during checkout');
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = 'Place Order';
    }
  });
});
