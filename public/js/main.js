// ===== Toast System =====
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== Router =====
const router = {
  routes: {
    home: renderHome,
    about: renderAbout,
    projects: renderProjects,
    skills: renderSkills,
    login: renderLogin,
    logout: () => auth.logout(),
    admin: () => admin.init(),
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();

    document.querySelector('.nav-toggle').addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
      });
    });

    document.getElementById('year').textContent = new Date().getFullYear();
    auth.init();
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const handler = this.routes[hash] || this.routes.home;
    handler();

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
    });

    window.scrollTo(0, 0);
  },

  navigate(page) {
    window.location.hash = page;
  },
};

// ===== Home / Hero =====
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">Welcome to my Portfolio</div>
        <h1 class="hero-title">
          Hi, I'm <span class="highlight" id="hero-name">Developer</span>
        </h1>
        <p class="hero-subtitle" id="hero-title">Full Stack Developer crafting modern web experiences</p>
        <div class="hero-buttons">
          <a href="#projects" class="btn btn-primary"><i class="fas fa-rocket"></i> View Projects</a>
          <a href="#about" class="btn btn-outline"><i class="fas fa-user"></i> About Me</a>
        </div>
    </section>
  `;
  loadHeroData();
}

async function loadHeroData() {
  try {
    const profile = await api.getPublicProfile();
    const nameEl = document.getElementById('hero-name');
    const titleEl = document.getElementById('hero-title');
    if (nameEl) nameEl.textContent = profile.fullName || profile.User?.name || 'Developer';
    if (titleEl) titleEl.textContent = profile.title || 'Full Stack Developer';
  } catch (err) {
    // Use defaults
  }
}

// ===== About =====
function renderAbout() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <h2 class="section-title">About <span>Me</span></h2>
      <p class="section-subtitle">Get to know more about me and my background</p>
      <div class="about-grid">
        <div class="about-image"><i class="fas fa-user"></i></div>
        <div class="about-content" id="about-content">
          <div class="loading"><i class="fas fa-spinner"></i></div>
      </div>
    </section>
  `;
  loadAboutData();
}

async function loadAboutData() {
  try {
    const profile = await api.getPublicProfile();
    const container = document.getElementById('about-content');
    if (!container) return;

    container.innerHTML = `
      <h3>${profile.fullName || 'Developer'}</h3>
      <p><strong>${profile.title || 'Full Stack Developer'}</strong></p>
      <p>${profile.bio || 'Passionate developer building amazing web applications.'}</p>
      <div class="about-info">
        ${profile.location ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i><span>${profile.location}</span></div>` : ''}
        ${profile.phone ? `<div class="info-item"><i class="fas fa-phone"></i><span>${profile.phone}</span></div>` : ''}
        ${profile.User?.email ? `<div class="info-item"><i class="fas fa-envelope"></i><span>${profile.User.email}</span></div>` : ''}
      </div>
      <div class="social-links">
        ${profile.github ? `<a href="${profile.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
        ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
        ${profile.website ? `<a href="${profile.website}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
      </div>
    `;
  } catch (err) {
    const container = document.getElementById('about-content');
    if (container) container.innerHTML = '<p>Unable to load profile data.</p>';
  }
}

// ===== Projects =====
function renderProjects() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <h2 class="section-title">My <span>Projects</span></h2>
      <p class="section-subtitle">A selection of my recent work</p>
      <div class="projects-grid" id="projects-grid">
        <div class="loading"><i class="fas fa-spinner"></i></div>
    </section>
  `;
  loadProjectsData();
}

async function loadProjectsData() {
  try {
    const projects = await api.getPublicProjects();
    const container = document.getElementById('projects-grid');
    if (!container) return;

    if (!projects.length) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No projects to display yet.</p></div>';
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-image">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-code\\'></i>'">` : '<i class="fas fa-code"></i>'}
        </div>
        <div class="project-content">
          <h3>${p.title}</h3>
          <p>${p.description || ''}</p>
          <div class="project-tags">
            ${(Array.isArray(p.technologies) ? p.technologies : (p.technologies || '').split(',')).filter(Boolean).map(t => `<span class="tag">${t.trim()}</span>`).join('')}
          </div>
          <div class="project-links">
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Live Demo</a>` : ''}
            ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank">Source Code</a>` : ''}
          </div>
      </div>
    `).join('');
  } catch (err) {
    const container = document.getElementById('projects-grid');
    if (container) container.innerHTML = `<div class="empty-state"><p>Error loading projects: ${err.message}</p></div>`;
  }
}

// ===== Skills =====
function renderSkills() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <h2 class="section-title">My <span>Skills</span></h2>
      <p class="section-subtitle">Technologies and tools I work with</p>
      <div class="skills-container" id="skills-container">
        <div class="loading"><i class="fas fa-spinner"></i></div>
    </section>
  `;
  loadSkillsData();
}

async function loadSkillsData() {
  try {
    const skills = await api.getPublicSkills();
    const container = document.getElementById('skills-container');
    if (!container) return;

    if (!skills.length) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-code"></i><p>No skills to display yet.</p></div>';
      return;
    }

    const categories = {};
    skills.forEach(s => {
      if (!categories[s.category]) categories[s.category] = [];
      categories[s.category].push(s);
    });

    const categoryIcons = {
      frontend: 'fa-laptop-code',
      backend: 'fa-server',
      database: 'fa-database',
      devops: 'fa-cloud',
      tools: 'fa-tools',
      soft: 'fa-users',
    };

    container.innerHTML = Object.entries(categories).map(([cat, items]) => `
      <div class="skill-category">
        <h3><i class="fas ${categoryIcons[cat] || 'fa-code'}"></i> ${cat}</h3>
        ${items.map(s => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-percent">${s.proficiency || 0}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" style="width: 0%" data-width="${s.proficiency || 0}%"></div>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 100);
  } catch (err) {
    const container = document.getElementById('skills-container');
    if (container) container.innerHTML = `<div class="empty-state"><p>Error loading skills: ${err.message}</p></div>`;
  }
}

// ===== Login / Register =====
function renderLogin() {
  if (auth.isLoggedIn()) {
    router.navigate('admin');
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section" style="max-width: 480px; margin: 0 auto;">
      <div class="auth-container" id="login-box">
        <h2>Welcome Back</h2>
        <p>Sign in to manage your portfolio</p>
        <form onsubmit="auth.handleLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" required placeholder="Enter your password">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Sign In</button>
        </form>
        <div class="auth-toggle">
          Don't have an account? <a href="#" onclick="event.preventDefault(); showRegister()">Register</a>
        </div>

      <div class="auth-container" id="register-box" style="display:none">
        <h2>Create Account</h2>
        <p>Register to start managing your portfolio</p>
        <form onsubmit="auth.handleRegister(event)">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="reg-name" required placeholder="Your name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="reg-email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="reg-password" required placeholder="Choose a password">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Create Account</button>
        </form>
        <div class="auth-toggle">
          Already have an account? <a href="#" onclick="event.preventDefault(); showLogin()">Sign In</a>
        </div>
    </section>
  `;
}

function showRegister() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'block';
}

function showLogin() {
  document.getElementById('register-box').style.display = 'none';
  document.getElementById('login-box').style.display = 'block';
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  router.init();
});
