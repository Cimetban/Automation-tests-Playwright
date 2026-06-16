import { fetchReturns, submitReturn, deleteReturn } from './client-api.js';

const returnForm = document.getElementById('return-form');
const returnMessage = document.getElementById('return-message');
const returnHistory = document.getElementById('return-history');

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function loadReturns() {
  returnHistory.innerHTML = '';

  try {
    const response = await fetchReturns();
    renderReturns(response.returns || []);
  } catch (error) {
    returnHistory.innerHTML = '<p class="empty-message">Unable to load return history. Please try again later.</p>';
  }
}

function renderReturns(returns) {
  returnHistory.innerHTML = '';

  if (returns.length === 0) {
    returnHistory.innerHTML = '<p class="empty-message">No return requests yet.</p>';
    return;
  }

  returns.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'return-item';
    row.innerHTML = `
      <div class="return-info">
        <h3>Order ${item.orderId}</h3>
        <p><strong>Reason:</strong> ${item.reason}</p>
        <p><strong>Submitted:</strong> ${formatDate(item.date)}</p>
        <p><strong>Status:</strong> <span class="status ${item.status}">${item.status}</span></p>
      </div>
      <div class="return-actions">
        <button class="button button-secondary remove-return" data-order-id="${item.orderId}">Remove</button>
      </div>
    `;
    returnHistory.appendChild(row);
  });
}

returnForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const orderId = returnForm.orderId.value.trim();
  const reason = returnForm.returnReason.value;
  const comments = returnForm.comments.value.trim();

  if (!orderId || !reason) {
    returnMessage.textContent = 'Please fill in all required fields.';
    returnMessage.className = 'form-message error';
    return;
  }

  try {
    const response = await submitReturn(orderId, reason, comments);
    returnMessage.textContent = response.message || `Return request for ${orderId} submitted successfully. We will process it shortly.`;
    returnMessage.className = 'form-message success';
    returnForm.reset();
    await loadReturns();
  } catch (error) {
    returnMessage.textContent = error.message;
    returnMessage.className = 'form-message error';
  }
});

returnHistory.addEventListener('click', async (event) => {
  const button = event.target.closest('.remove-return');
  if (!button) return;

  const orderId = button.dataset.orderId;
  try {
    await deleteReturn(orderId);
    await loadReturns();
  } catch (error) {
    returnMessage.textContent = error.message;
    returnMessage.className = 'form-message error';
  }
});

loadReturns();
