const API_BASE = window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null' ? 'http://localhost:3000/api' : '/api';
const SESSION_TOKEN_KEY = 'shopEaseSessionToken';

function getSessionToken() {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

function setSessionToken(token) {
  if (token) {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

async function apiFetch(path, options = {}) {
  const token = getSessionToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  });

  const sessionToken = response.headers.get('x-session-token');
  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = body.error || response.statusText || 'API request failed';
    throw new Error(error);
  }

  return response.json();
}

export async function login(email, password) {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchProducts() {
  return apiFetch('/products');
}

export async function fetchCart() {
  return apiFetch('/cart');
}

export async function addToCartItem(productId, quantity = 1) {
  return apiFetch('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return apiFetch('/cart/update', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function checkout(paymentData) {
  return apiFetch('/checkout', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

export async function fetchReturns() {
  return apiFetch('/returns');
}

export async function submitReturn(orderId, reason, comments) {
  return apiFetch('/returns', {
    method: 'POST',
    body: JSON.stringify({ orderId, reason, comments }),
  });
}

export async function deleteReturn(orderId) {
  return apiFetch('/returns/remove', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}
