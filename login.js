import { login } from './client-api.js';

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    loginMessage.textContent = 'Please enter both email and password.';
    loginMessage.className = 'form-message error';
    return;
  }

  try {
    await login(email, password);
    loginMessage.textContent = 'Login successful. Redirecting to home...';
    loginMessage.className = 'form-message success';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.className = 'form-message error';
  }
});
