const Auth = {
  get user() {
    try { return JSON.parse(localStorage.getItem('demo_user')); }
    catch { return null; }
  },
  login(name) { localStorage.setItem('demo_user', JSON.stringify({ name })); },
  logout() { localStorage.removeItem('demo_user'); },

  playlistKey() { const u = Auth.user; return u ? `pl_${u.name}` : null; },
  ratingKey()  { const u = Auth.user; return u ? `rate_${u.name}` : null; },

  syncHeader() {
    const badge = document.getElementById('userBadge');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!badge || !loginLink || !logoutBtn) return;

    const isLogged = !!Auth.user;
    badge.classList.toggle('hidden', !isLogged);
    logoutBtn.classList.toggle('hidden', !isLogged);
    loginLink.classList.toggle('hidden', isLogged);

    if (isLogged) badge.textContent = `로그인: ${Auth.user.name}`;
    logoutBtn.onclick = () => { Auth.logout(); location.reload(); };
  }
};

document.addEventListener('DOMContentLoaded', Auth.syncHeader);
