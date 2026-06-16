const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Comfy Sneakers', description: 'Lightweight sneakers for daily wear with breathable mesh and cushioned soles.', price: 68.0, image: 'https://images.unsplash.com/photo-1552346154-8f5b35e872c7?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Classic Watch', description: 'Minimalist wristwatch with leather strap and elegant finishing.', price: 112.0, image: 'https://images.unsplash.com/photo-1518544265069-8e6a4a17da1d?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Wireless Headphones', description: 'Noise-canceling headphones with long battery life and superior sound.', price: 149.0, image: 'https://images.unsplash.com/photo-1518444021603-6cb26a8edc56?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Elegant Backpack', description: 'Durable travel backpack with padded laptop pocket and modern design.', price: 79.0, image: 'https://images.unsplash.com/photo-1514511129765-4f963ae9817a?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'Smart Mug', description: 'Temperature-controlled mug that keeps your drink warm for hours.', price: 42.0, image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2fda9?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Desk Lamp', description: 'Adjustable desk lamp with warm light and touch controls.', price: 34.0, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80' },
];

const users = {
  'user@example.com': { password: 'password123', email: 'user@example.com', name: 'Demo User' },
};

const sessions = new Map();

function createSession() {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { cart: [], returns: [], user: null });
  return token;
}

function getSession(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}

app.use((req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  let session = getSession(token);
  let sessionToken = token;

  if (!session) {
    sessionToken = createSession();
    session = getSession(sessionToken);
  }

  req.sessionToken = sessionToken;
  req.session = session;
  res.setHeader('X-Session-Token', sessionToken);
  next();
});

app.get('/api/session', (req, res) => {
  const { sessionToken, session } = req;
  res.json({ token: sessionToken, cart: session.cart, returns: session.returns, user: session.user });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.user = { email: user.email, name: user.name };
  return res.json({ success: true, message: 'Login successful.', user: req.session.user });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  res.json({ cart: req.session.cart });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find((item) => item.id === Number(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const existing = req.session.cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    req.session.cart.push({ product, quantity: Number(quantity) });
  }

  res.json({ cart: req.session.cart });
});

app.post('/api/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find((item) => item.id === Number(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const existing = req.session.cart.find((item) => item.product.id === product.id);
  if (!existing) {
    return res.status(404).json({ error: 'Cart item not found.' });
  }

  const qty = Number(quantity);
  if (qty <= 0) {
    req.session.cart = req.session.cart.filter((item) => item.product.id !== product.id);
  } else {
    existing.quantity = qty;
  }

  res.json({ cart: req.session.cart });
});

app.post('/api/checkout', (req, res) => {
  const { fullName, cardNumber, expiryDate, cvv, billingAddress } = req.body;

  if (!fullName || !cardNumber || !expiryDate || !cvv || !billingAddress) {
    return res.status(400).json({ error: 'All payment fields are required.' });
  }

  if (req.session.cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  // Simulate payment validation and order processing.
  req.session.cart = [];
  return res.json({ success: true, message: 'Payment successful! Thank you for your purchase.' });
});

app.get('/api/returns', (req, res) => {
  res.json({ returns: req.session.returns });
});

app.post('/api/returns', (req, res) => {
  const { orderId, reason, comments } = req.body;

  if (!orderId || !reason) {
    return res.status(400).json({ error: 'Order ID and reason are required.' });
  }

  const returnRequest = {
    orderId,
    reason,
    comments: comments || '',
    date: new Date().toISOString(),
    status: 'pending',
  };

  req.session.returns.push(returnRequest);
  res.json({ returns: req.session.returns, message: 'Return request submitted successfully.' });
});

app.post('/api/returns/remove', (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required to remove a return.' });
  }

  req.session.returns = req.session.returns.filter((item) => item.orderId !== orderId);
  res.json({ returns: req.session.returns });
});

app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ShopEase API server running at http://localhost:${port}`);
});