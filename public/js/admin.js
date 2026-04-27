const admin = {
  currentTab: 'projects',
  editingProject: null,
  editingSkill: null,

  async init() {
    if (!auth.requireAuth()) return;
    this.render();
    this.loadTab('projects');
  },

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <div class="admin-header">
          <h2 class="section-title">Admin <span>Dashboard</span></h2>
          <button class="btn btn-primary" onclick="admin.openProfileModal()">
            <i class="fas fa-user-edit"></i> Edit Profile
          </button>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="projects" onclick="admin.loadTab('projects')">Projects</button>
          <button class="admin-tab" data-tab="skills" onclick="admin.loadTab('skills')">Skills</button>
        </div>

        <div class="admin-section active" id="projects-section">
          <div class="admin-header">
            <h3>Manage Projects</h3>
            <button class="btn btn-primary btn-sm" onclick="admin.openProjectModal()">
              <i class="fas fa-plus"></i> Add Project
            </button>
          </div>
          <div id="projects-table"></div>

        <div class="admin-section" id="skills-section">
          <div class="admin-header">
            <h3>Manage Skills</h3>
            <button class="btn btn-primary btn-sm" onclick="admin.openSkillModal()">
              <i class="fas fa-plus"></i> Add Skill
            </button>
          </div>
          <div id="skills-table"></div>
      </section>

      <div class="modal-overlay" id="project-modal">
        <div class="modal">
          <div class="modal-header">
            <h3 id="project-modal-title">Add Project</h3>
            <button class="modal-close" onclick="admin.closeProjectModal()">&times;</button>
          </div>
          <form id="project-form" onsubmit="admin.handleProjectSubmit(event)">
            <input type="hidden" id="project-id">
            <div class="form-group">
              <label>Title *</label>
              <input type="text" id="project-title" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="project-description"></textarea>
            </div>
            <div class="form-group">
              <label>Technologies (comma separated)</label>
              <input type="text" id="project-technologies" placeholder="React, Node.js, MongoDB">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Live URL</label>
                <input type="url" id="project-liveUrl">
              </div>
              <div class="form-group">
                <label>Repo URL</label>
                <input type="url" id="project-repoUrl">
              </div>
            <div class="form-group">
              <label>Image URL</label>
              <input type="url" id="project-imageUrl">
            </div>
            <div class="form-group">
              <label><input type="checkbox" id="project-featured"> Featured Project</label>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%">Save Project</button>
          </form>
        </div>

      <div class="modal-overlay" id="skill-modal">
        <div class="modal">
          <div class="modal-header">
            <h3 id="skill-modal-title">Add Skill</h3>
            <button class="modal-close" onclick="admin.closeSkillModal()">&times;</button>
          </div>
          <form id="skill-form" onsubmit="admin.handleSkillSubmit(event)">
            <input type="hidden" id="skill-id">
            <div class="form-row">
              <div class="form-group">
                <label>Name *</label>
                <input type="text" id="skill-name" required>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select id="skill-category">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="tools">Tools</option>
                  <option value="soft">Soft Skills</option>
                </select>
              </div>
            <div class="form-group">
              <label>Proficiency (1-100)</label>
              <input type="number" id="skill-proficiency" min="1" max="100" value="80">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%">Save Skill</button>
          </form>
        </div>

      <div class="modal-overlay" id="profile-modal">
        <div class="modal">
          <div class="modal-header">
            <h3>Edit Profile</h3>
            <button class="modal-close" onclick="admin.closeProfileModal()">&times;</button>
          </div>
          <form id="profile-form" onsubmit="admin.handleProfileSubmit(event)">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="profile-fullName">
              </div>
              <div class="form-group">
                <label>Title</label>
                <input type="text" id="profile-title">
              </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea id="profile-bio"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Location</label>
                <input type="text" id="profile-location">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="text" id="profile-phone">
              </div>
            <div class="form-row">
              <div class="form-group">
                <label>GitHub URL</label>
                <input type="url" id="profile-github">
              </div>
              <div class="form-group">
                <label>LinkedIn URL</label>
                <input type="url" id="profile-linkedin">
              </div>
            <div class="form-group">
              <label>Website URL</label>
              <input type="url" id="profile-website">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%">Save Profile</button>
          </form>
        </div>
    `;

    ['project-modal', 'skill-modal', 'profile-modal'].forEach(id => {
      document.getElementById(id).addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          const closeFn = id === 'project-modal' ? 'closeProjectModal' : id === 'skill-modal' ? 'closeSkillModal' : 'closeProfileModal';
          admin[closeFn]();
        }
      });
    });
  },

  loadTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('active', s.id === `${tab}-section`));
    if (tab === 'projects') this.loadProjects();
    if (tab === 'skills') this.loadSkills();
  },

  async loadProjects() {
    const container = document.getElementById('projects-table');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i></div>';
    try {
      const projects = await api.getProjects();
      if (!projects.length) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No projects yet. Add your first project!</p></div>';
        return;
      }
      container.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Title</th><th>Technologies</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td><strong>${p.title}</strong></td>
                <td>${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}</td>
                <td>${p.featured ? '<i class="fas fa-star" style="color:var(--warning)"></i>' : '-'}</td>
                <td class="table-actions">
                  <button class="btn-edit" onclick="admin.editProject(${p.id})"><i class="fas fa-edit"></i></button>
                  <button class="btn-delete" onclick="admin.deleteProject(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
    }
  },

  async loadSkills() {
    const container = document.getElementById('skills-table');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i></div>';
    try {
      const skills = await api.getSkills();
      if (!skills.length) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-code"></i><p>No skills yet. Add your first skill!</p></div>';
        return;
      }
      container.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Name</th><th>Category</th><th>Proficiency</th><th>Actions</th></tr></thead>
          <tbody>
            ${skills.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="tag">${s.category}</span></td>
                <td>
                  <div class="skill-bar" style="width:100px;display:inline-block;vertical-align:middle;margin-right:8px;">
                    <div class="skill-progress" style="width:${s.proficiency || 0}%"></div>
                  ${s.proficiency || 0}%
                </td>
                <td class="table-actions">
                  <button class="btn-edit" onclick="admin.editSkill(${s.id})"><i class="fas fa-edit"></i></button>
                  <button class="btn-delete" onclick="admin.deleteSkill(${s.id})"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
    }
  },

  openProjectModal() {
    this.editingProject = null;
    document.getElementById('project-modal-title').textContent = 'Add Project';
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-modal').classList.add('active');
  },

  closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
  },

  async editProject(id) {
    try {
      const projects = await api.getProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return;
      this.editingProject = project;
      document.getElementById('project-modal-title').textContent = 'Edit Project';
      document.getElementById('project-id').value = project.id;
      document.getElementById('project-title').value = project.title;
      document.getElementById('project-description').value = project.description || '';
      document.getElementById('project-technologies').value = Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '';
      document.getElementById('project-liveUrl').value = project.liveUrl || '';
      document.getElementById('project-repoUrl').value = project.repoUrl || '';
      document.getElementById('project-imageUrl').value = project.imageUrl || '';
      document.getElementById('project-featured').checked = project.featured;
      document.getElementById('project-modal').classList.add('active');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleProjectSubmit(e) {
    e.preventDefault();
    const body = {
      title: document.getElementById('project-title').value,
      description: document.getElementById('project-description').value,
      technologies: document.getElementById('project-technologies').value.split(',').map(t => t.trim()).filter(Boolean),
      liveUrl: document.getElementById('project-liveUrl').value,
      repoUrl: document.getElementById('project-repoUrl').value,
      imageUrl: document.getElementById('project-imageUrl').value,
      featured: document.getElementById('project-featured').checked,
    };
    try {
      if (this.editingProject) {
        await api.updateProject(this.editingProject.id, body);
        showToast('Project updated!', 'success');
      } else {
        await api.createProject(body);
        showToast('Project created!', 'success');
      }
      this.closeProjectModal();
      this.loadProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project deleted!', 'success');
      this.loadProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  openSkillModal() {
    this.editingSkill = null;
    document.getElementById('skill-modal-title').textContent = 'Add Skill';
    document.getElementById('skill-form').reset();
    document.getElementById('skill-id').value = '';
    document.getElementById('skill-modal').classList.add('active');
  },

  closeSkillModal() {
    document.getElementById('skill-modal').classList.remove('active');
  },

  async editSkill(id) {
    try {
      const skills = await api.getSkills();
      const skill = skills.find(s => s.id === id);
      if (!skill) return;
      this.editingSkill = skill;
      document.getElementById('skill-modal-title').textContent = 'Edit Skill';
      document.getElementById('skill-id').value = skill.id;
      document.getElementById('skill-name').value = skill.name;
      document.getElementById('skill-category').value = skill.category;
      document.getElementById('skill-proficiency').value = skill.proficiency || 80;
      document.getElementById('skill-modal').classList.add('active');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async handleSkillSubmit(e) {
    e.preventDefault();
    const body = {
      name: document.getElementById('skill-name').value,
      category: document.getElementById('skill-category').value,
      proficiency: parseInt(document.getElementById('skill-proficiency').value) || 80,
    };
    try {
      if (this.editingSkill) {
        await api.updateSkill(this.editingSkill.id, body);
        showToast('Skill updated!', 'success');
      } else {
        await api.createSkill(body);
        showToast('Skill created!', 'success');
      }
      this.closeSkillModal();
      this.loadSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async deleteSkill(id) {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      showToast('Skill deleted!', 'success');
      this.loadSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async openProfileModal() {
    try {
      const profile = await api.getProfile();
      document.getElementById('profile-fullName').value = profile.fullName || '';
      document.getElementById('profile-title').value = profile.title || '';
      document.getElementById('profile-bio').value = profile.bio || '';
      document.getElementById('profile-location').value = profile.location || '';
      document.getElementById('profile-phone').value = profile.phone || '';
      document.getElementById('profile-github').value = profile.github || '';
      document.getElementById('profile-linkedin').value = profile.linkedin || '';
      document.getElementById('profile-website').value = profile.website || '';
    } catch (err) {
      document.getElementById('profile-form').reset();
    }
    document.getElementById('profile-modal').classList.add('active');
  },

  closeProfileModal() {
    document.getElementById('profile-modal').classList.remove('active');
  },

  async handleProfileSubmit(e) {
    e.preventDefault();
    const body = {
      fullName: document.getElementById('profile-fullName').value,
      title: document.getElementById('profile-title').value,
      bio: document.getElementById('profile-bio').value,
      location: document.getElementById('profile-location').value,
      phone: document.getElementById('profile-phone').value,
      github: document.getElementById('profile-github').value,
      linkedin: document.getElementById('profile-linkedin').value,
      website: document.getElementById('profile-website').value,
    };
    try {
      try {
        await api.getProfile();
        await api.updateProfile(body);
        showToast('Profile updated!', 'success');
      } catch {
        await api.createProfile(body);
        showToast('Profile created!', 'success');
      }
      this.closeProfileModal();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },
};
