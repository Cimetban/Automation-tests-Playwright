const products = [
  {
    id: 1,
    name: 'Comfy Sneakers',
    description: 'Lightweight sneakers for daily wear with breathable mesh and cushioned soles.',
    price: 68.0,
    image: 'https://images.unsplash.com/photo-1552346154-8f5b35e872c7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Classic Watch',
    description: 'Minimalist wristwatch with leather strap and elegant finishing.',
    price: 112.0,
    image: 'https://images.unsplash.com/photo-1518544265069-8e6a4a17da1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    description: 'Noise-canceling headphones with long battery life and superior sound.',
    price: 149.0,
    image: 'https://images.unsplash.com/photo-1518444021603-6cb26a8edc56?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Elegant Backpack',
    description: 'Durable travel backpack with padded laptop pocket and modern design.',
    price: 79.0,
    image: 'https://images.unsplash.com/photo-1514511129765-4f963ae9817a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Smart Mug',
    description: 'Temperature-controlled mug that keeps your drink warm for hours.',
    price: 42.0,
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2fda9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Desk Lamp',
    description: 'Adjustable desk lamp with warm light and touch controls.',
    price: 34.0,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
  },
];

const productGrid = document.getElementById('product-grid');
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

const CART_KEY = 'shopEaseCart';
const cart = new Map();

function loadCartState() {
  const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  storedCart.forEach((item) => {
    cart.set(item.product.id, { product: item.product, quantity: item.quantity });
  });
}

function saveCartState() {
  const items = Array.from(cart.values()).map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

loadCartState();

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

function renderProducts() {
  products.forEach((product) => {
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

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (cart.has(productId)) {
    cart.get(productId).quantity += 1;
  } else {
    cart.set(productId, { product, quantity: 1 });
  }

  updateCartSummary();
  renderCartItems();
  saveCartState();
}

function changeCartQuantity(productId, delta) {
  if (!cart.has(productId)) return;

  const item = cart.get(productId);
  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.delete(productId);
  }

  updateCartSummary();
  renderCartItems();
  saveCartState();
}

function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  cart.delete(productId);
  updateCartSummary();
  renderCartItems();
}

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.classList.contains('add-to-cart')) {
    const productId = Number(button.dataset.productId);
    addToCart(productId);
    openCart();
  }
});

cartItemsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;

  if (action === 'increase') {
    changeCartQuantity(productId, 1);
  } else if (action === 'decrease') {
    changeCartQuantity(productId, -1);
  } else if (action === 'remove') {
    removeFromCart(productId);
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
  saveCartState();
  window.location.href = 'payment.html';
});

renderProducts();
updateCartSummary();
renderCartItems();
