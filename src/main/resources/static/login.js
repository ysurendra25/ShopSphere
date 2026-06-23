// Login page functionality

function switchToAdminLogin() {
  document.getElementById('roleSelection').style.display = 'none';
  document.getElementById('adminLoginForm').style.display = 'block';
}

function switchToCustomerLogin() {
  document.getElementById('roleSelection').style.display = 'none';
  document.getElementById('customerLoginForm').style.display = 'block';
}

function backToRoleSelection() {
  document.getElementById('roleSelection').style.display = 'block';
  document.getElementById('adminLoginForm').style.display = 'none';
  document.getElementById('customerLoginForm').style.display = 'none';
  document.getElementById('adminUsername').value = '';
  document.getElementById('adminPassword').value = '';
  document.getElementById('customerUsername').value = '';
  document.getElementById('customerPassword').value = '';
  clearMessage('adminLoginMsg');
  clearMessage('customerLoginMsg');
  hideRegisterForm('admin');
  hideRegisterForm('customer');
}

// ─── Show / hide register panels ───────────────────────────────────────────
function showRegisterForm(type) {
  if (type === 'admin') {
    document.getElementById('adminRegisterSection').style.display = 'block';
    document.getElementById('adminRegMsg').textContent = '';
  } else {
    document.getElementById('customerRegisterSection').style.display = 'block';
    document.getElementById('custRegMsg').textContent = '';
  }
}

function hideRegisterForm(type) {
  if (type === 'admin') {
    document.getElementById('adminRegisterSection').style.display = 'none';
    document.getElementById('adminRegisterForm').reset();
    document.getElementById('adminRegMsg').textContent = '';
  } else {
    document.getElementById('customerRegisterSection').style.display = 'none';
    document.getElementById('customerRegisterForm').reset();
    document.getElementById('custRegMsg').textContent = '';
  }
}

// ─── Register ──────────────────────────────────────────────────────────────
async function handleRegister(event, isAdmin) {
  event.preventDefault();

  const msgElId = isAdmin ? 'adminRegMsg' : 'custRegMsg';
  const msgEl   = document.getElementById(msgElId);

  const name     = isAdmin
    ? document.getElementById('adminRegName').value.trim()
    : document.getElementById('custRegName').value.trim();
  const username = isAdmin
    ? document.getElementById('adminRegUsername').value.trim()
    : document.getElementById('custRegUsername').value.trim();
  const password = isAdmin
    ? document.getElementById('adminRegPassword').value
    : document.getElementById('custRegPassword').value;

  if (!name || !username || !password) {
    showMessage(msgEl, 'Please fill in all fields.', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password, isAdmin })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(msgEl, data.message || 'Registration failed. Try a different username.', 'error');
      return;
    }

    showMessage(msgEl, 'Registered successfully! You can now log in.', 'success');
    // Auto-hide register form after success and fill in the login fields
    setTimeout(() => {
      hideRegisterForm(isAdmin ? 'admin' : 'customer');
      if (isAdmin) {
        document.getElementById('adminUsername').value = username;
        document.getElementById('adminPassword').focus();
      } else {
        document.getElementById('customerUsername').value = username;
        document.getElementById('customerPassword').focus();
      }
    }, 1500);

  } catch (error) {
    console.error('Register error:', error);
    showMessage(msgEl, 'Server error. Please try again.', 'error');
  }
}

// ─── Admin Login ───────────────────────────────────────────────────────────
async function handleAdminLogin(event) {
  event.preventDefault();
  const username  = document.getElementById('adminUsername').value.trim();
  const password  = document.getElementById('adminPassword').value;
  const messageEl = document.getElementById('adminLoginMsg');

  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(messageEl, data.message || 'Login failed', 'error');
      return;
    }

    // Check if user is admin
    if (data.role && data.role.toUpperCase() === 'ADMIN') {
      sessionStorage.setItem('userSession', JSON.stringify({
        token: data.token,
        username: data.username,
        role: 'admin'
      }));
      showMessage(messageEl, 'Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = '/admin-dashboard.html'; }, 1000);
    } else {
      showMessage(messageEl, 'Access denied: this account does not have Admin privileges.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage(messageEl, 'Server error. Please try again.', 'error');
  }
}

// ─── Customer Login ────────────────────────────────────────────────────────
async function handleCustomerLogin(event) {
  event.preventDefault();
  const username  = document.getElementById('customerUsername').value.trim();
  const password  = document.getElementById('customerPassword').value;
  const messageEl = document.getElementById('customerLoginMsg');

  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(messageEl, data.message || 'Login failed', 'error');
      return;
    }

    // Customers must NOT be admin
    if (data.role && data.role.toUpperCase() === 'ADMIN') {
      showMessage(messageEl, 'Please use Admin Login for admin accounts.', 'error');
      return;
    }

    sessionStorage.setItem('userSession', JSON.stringify({
      token: data.token,
      username: data.username,
      role: 'customer'
    }));
    showMessage(messageEl, 'Login successful! Redirecting...', 'success');
    setTimeout(() => { window.location.href = '/customer-dashboard.html'; }, 1000);

  } catch (error) {
    console.error('Login error:', error);
    showMessage(messageEl, 'Server error. Please try again.', 'error');
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `login-message show ${type}`;
  if (type === 'success') {
    setTimeout(() => {
      element.className = 'login-message';
      element.textContent = '';
    }, 3000);
  }
}

function clearMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.className = 'login-message';
  }
}
