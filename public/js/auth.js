const auth = {
  user: null,

  init() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.user = JSON.parse(userStr);
      this.updateNav();
    }
  },

  isLoggedIn() {
    return !!this.user && !!localStorage.getItem('token');
  },

  updateNav() {
    const adminLink = document.getElementById('admin-link');
    const loginLink = document.getElementById('login-nav-link');
    if (this.isLoggedIn()) {
      if (adminLink) adminLink.style.display = 'inline-block';
      if (loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#logout';
        loginLink.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
      }
    } else {
      if (adminLink) adminLink.style.display = 'none';
      if (loginLink) {
        loginLink.textContent = 'Login';
        loginLink.href = '#login';
        loginLink.onclick = null;
      }
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.updateNav();
    showToast('Logged out successfully', 'success');
    router.navigate('home');
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      auth.user = data.user;
      auth.updateNav();
      showToast('Login successful!', 'success');
      router.navigate('admin');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
      const data = await api.register(name, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      auth.user = data.user;
      auth.updateNav();
      showToast('Registration successful!', 'success');
      router.navigate('admin');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      showToast('Please log in to access this page', 'error');
      router.navigate('login');
      return false;
    }
    return true;
  },
};
