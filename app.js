// Core Application Logic and State Management

const API_URL = '/api';

// Cart State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
  }
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }
}

// Authentication State
function checkAuth() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const authSection = document.getElementById('auth-section');
  
  if (authSection) {
    if (token) {
      authSection.innerHTML = `
        <span style="color: var(--text-secondary); margin-right: 1rem;">Hello, ${username}</span>
        <a href="#" id="logout-btn">Logout</a>
      `;
      document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload();
      });
    } else {
      authSection.innerHTML = `<a href="/login.html">Login</a>`;
    }
  }
  return token;
}

// Render Products (Index page)
async function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    
    container.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/400x300/1e293b/818cf8?text=Product+Image'">
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <div style="margin-top: auto; display: flex; gap: 0.5rem;">
            <a href="/product.html?id=${product.id}" class="btn" style="background: rgba(255,255,255,0.1); flex: 1;">Details</a>
            <button class="btn add-to-cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' style="flex: 1;">Add</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const product = JSON.parse(e.target.getAttribute('data-product'));
        addToCart(product);
      });
    });
  } catch (error) {
    console.error('Failed to fetch products', error);
    container.innerHTML = '<p>Failed to load products. Please try again later.</p>';
  }
}

// Render Cart (Cart page)
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-amount');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <div class="cart-item-details">
          <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/1e293b/818cf8?text=Img'">
          <div>
            <h4>${item.name}</h4>
            <p style="color: var(--text-secondary)">$${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
        </div>
        <div>
          <span style="font-weight: 600; margin-right: 1rem;">$${itemTotal.toFixed(2)}</span>
          <button class="btn" style="background: #ef4444; padding: 0.5rem 1rem;" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) {
    totalEl.textContent = total.toFixed(2);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  checkAuth();
  
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    renderProducts();
  } else if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }
});
