const API_BASE = `${window.location.origin}/api`;

const api = {
  // Public endpoints (no auth)
  async getPublicProfile() {
    const res = await fetch(`${API_BASE}/public/profile`);
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async getPublicProjects() {
    const res = await fetch(`${API_BASE}/public/projects`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  },

  async getPublicSkills() {
    const res = await fetch(`${API_BASE}/public/skills`);
    if (!res.ok) throw new Error('Failed to load skills');
    return res.json();
  },

  // Auth endpoints
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Protected endpoints (require token)
  getToken() {
    return localStorage.getItem('token');
  },

  headers() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, { headers: this.headers() });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async createProfile(body) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create profile');
    return data;
  },

  async updateProfile(body) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`, { headers: this.headers() });
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  },

  async createProject(body) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create project');
    return data;
  },

  async updateProject(id, body) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update project');
    return data;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete project');
    return data;
  },

  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`, { headers: this.headers() });
    if (!res.ok) throw new Error('Failed to load skills');
    return res.json();
  },

  async createSkill(body) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create skill');
    return data;
  },

  async updateSkill(id, body) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update skill');
    return data;
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete skill');
    return data;
  },
};
