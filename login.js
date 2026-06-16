const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

const DEMO_EMAIL = 'user@example.com';
const DEMO_PASSWORD = 'password123';

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    loginMessage.textContent = 'Please enter both email and password.';
    loginMessage.className = 'form-message error';
    return;
  }

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem('shopEaseUser', JSON.stringify({ email }));
    loginMessage.textContent = 'Login successful. Redirecting to home...';
    loginMessage.className = 'form-message success';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    loginMessage.textContent = 'Invalid email or password. Please try again.';
    loginMessage.className = 'form-message error';
  }
});
