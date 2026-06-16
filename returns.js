const returnForm = document.getElementById('return-form');
const returnMessage = document.getElementById('return-message');
const returnHistory = document.getElementById('return-history');

const RETURNS_KEY = 'shopEaseReturns';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function loadReturns() {
  const returns = JSON.parse(localStorage.getItem(RETURNS_KEY) || '[]');
  renderReturns(returns);
}

function renderReturns(returns) {
  returnHistory.innerHTML = '';

  if (returns.length === 0) {
    returnHistory.innerHTML = '<p class="empty-message">No return requests yet.</p>';
    return;
  }

  returns.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'return-item';
    row.innerHTML = `
      <div class="return-info">
        <h3>Order ${item.orderId}</h3>
        <p><strong>Reason:</strong> ${item.reason}</p>
        <p><strong>Submitted:</strong> ${item.date}</p>
        <p><strong>Status:</strong> <span class="status ${item.status}">${item.status}</span></p>
      </div>
      <div class="return-actions">
        <button class="button button-secondary remove-return" data-index="${index}">Remove</button>
      </div>
    `;
    returnHistory.appendChild(row);
  });
}

returnForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const orderId = returnForm.orderId.value.trim();
  const reason = returnForm.returnReason.value;
  const comments = returnForm.comments.value.trim();

  if (!orderId || !reason) {
    returnMessage.textContent = 'Please fill in all required fields.';
    returnMessage.className = 'form-message error';
    return;
  }

  const returns = JSON.parse(localStorage.getItem(RETURNS_KEY) || '[]');
  const newReturn = {
    orderId,
    reason,
    comments,
    date: formatDate(new Date()),
    status: 'pending',
  };

  returns.push(newReturn);
  localStorage.setItem(RETURNS_KEY, JSON.stringify(returns));

  returnMessage.textContent = `Return request for ${orderId} submitted successfully. We will process it shortly.`;
  returnMessage.className = 'form-message success';

  returnForm.reset();
  loadReturns();
});

returnHistory.addEventListener('click', (event) => {
  const button = event.target.closest('.remove-return');
  if (!button) return;

  const index = Number(button.dataset.index);
  const returns = JSON.parse(localStorage.getItem(RETURNS_KEY) || '[]');
  returns.splice(index, 1);
  localStorage.setItem(RETURNS_KEY, JSON.stringify(returns));
  loadReturns();
});

loadReturns();
