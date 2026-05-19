// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  
  const loginContainer = document.getElementById('login-form-container');
  const registerContainer = document.getElementById('register-form-container');

  if (showRegisterLink && showLoginLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginContainer.classList.add('hidden');
      registerContainer.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          window.location.href = '/';
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (err) {
        alert('An error occurred during login');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
          alert('Registration successful! Please login.');
          registerContainer.classList.add('hidden');
          loginContainer.classList.remove('hidden');
        } else {
          alert(data.error || 'Registration failed');
        }
      } catch (err) {
        alert('An error occurred during registration');
      }
    });
  }
});
