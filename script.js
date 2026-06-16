const productGrid = document.getElementById('product-grid');
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

import { fetchProducts, fetchCart, addToCartItem, updateCartItem } from './client-api.js';

const cart = new Map();

async function loadCartState() {
  const response = await fetchCart();
  response.cart.forEach((item) => {
    cart.set(item.product.id, { product: item.product, quantity: item.quantity });
  });
}

async function syncCartState() {
  const response = await fetchCart();
  cart.clear();
  response.cart.forEach((item) => {
    cart.set(item.product.id, { product: item.product, quantity: item.quantity });
  });
}

function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <div class="product-card-body">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-meta">
        <span class="product-price">${formatCurrency(product.price)}</span>
        <button class="button button-secondary add-to-cart" data-product-id="${product.id}">Add to cart</button>
      </div>
    </div>
  `;
  return card;
}

async function renderProducts() {
  const response = await fetchProducts();
  response.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });
}

function updateCartSummary() {
  const totalQuantity = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Array.from(cart.values()).reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatCurrency(totalPrice);
  checkoutButton.disabled = totalQuantity === 0;
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';

  if (cart.size === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty. Add items to get started.</p>';
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <p class="cart-item-title">${item.product.name}</p>
        <p class="cart-item-meta">${item.quantity} × ${formatCurrency(item.product.price)}</p>
      </div>
      <div class="cart-item-actions">
        <button class="button-secondary quantity-button" data-action="decrease" data-product-id="${item.product.id}">-</button>
        <button class="button-secondary quantity-button" data-action="increase" data-product-id="${item.product.id}">+</button>
        <button class="button-secondary remove-button" data-action="remove" data-product-id="${item.product.id}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });
}

function openCart() {
  cartPanel.classList.add('open');
}

function closeCart() {
  cartPanel.classList.remove('open');
}

async function addToCart(productId) {
  await addToCartItem(productId);
  await syncCartState();
  updateCartSummary();
  renderCartItems();
}

async function changeCartQuantity(productId, delta) {
  if (!cart.has(productId)) return;

  const item = cart.get(productId);
  const quantity = item.quantity + delta;
  await updateCartItem(productId, quantity);
  await syncCartState();
  updateCartSummary();
  renderCartItems();
}

async function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  await updateCartItem(productId, 0);
  await syncCartState();
  updateCartSummary();
  renderCartItems();
}

productGrid.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.classList.contains('add-to-cart')) {
    const productId = Number(button.dataset.productId);
    await addToCart(productId);
    openCart();
  }
});

cartItemsContainer.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;

  if (action === 'increase') {
    await changeCartQuantity(productId, 1);
  } else if (action === 'decrease') {
    await changeCartQuantity(productId, -1);
  } else if (action === 'remove') {
    await removeFromCart(productId);
  }
});

cartToggle.addEventListener('click', () => {
  openCart();
});

cartClose.addEventListener('click', () => {
  closeCart();
});

checkoutButton.addEventListener('click', () => {
  if (cart.size === 0) return;
  window.location.href = 'payment.html';
});

async function initializeApp() {
  await renderProducts();
  await loadCartState();
  updateCartSummary();
  renderCartItems();
}

initializeApp();
