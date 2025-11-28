// assets/auth.js
(function () {
  const STORAGE_KEY = 'ep_user';

  function getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('user parse error', e);
      return null;
    }
  }

  function saveUser(name) {
    const user = {
      name,
      loggedIn: true,
      createdAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    location.href = './home.html';
  }

  function isLoggedIn() {
    const u = getUser();
    return !!(u && u.loggedIn);
  }

  // 상단 네비의 로그인/로그아웃/배지 상태 갱신
  function updateAuthUI() {
    const user = getUser();
    const loginLink = document.getElementById('loginLink');
    const userBadge = document.getElementById('userBadge');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!loginLink && !userBadge && !logoutBtn) return;

    if (user && user.loggedIn) {
      if (loginLink) loginLink.classList.add('hidden');
      if (userBadge) {
        userBadge.textContent = user.name + ' 님';
        userBadge.classList.remove('hidden');
      }
      if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
      if (loginLink) loginLink.classList.remove('hidden');
      if (userBadge) userBadge.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
    }

    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    }
  }

  // 로그인 안 되어 있으면 로그인 페이지로 튕기기 + redirect 지원
  function requireLogin(redirectPage) {
    if (isLoggedIn()) return;

    let msg = '로그인 후 이용할 수 있는 메뉴입니다.';
    if (redirectPage === 'playlist') {
      msg = '내 재생목록은 로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.';
    }

    alert(msg);

    const qs = redirectPage
      ? '?redirect=' + encodeURIComponent(redirectPage)
      : '';
    location.href = './login.html' + qs;
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    // 이 페이지가 보호 대상이면 body에 data-auth-required="playlist" 처럼 달기
    const body = document.body;
    if (body && body.dataset.authRequired) {
      requireLogin(body.dataset.authRequired);
    }
  });

  // 다른 스크립트에서 쓰기 위해 export
  window.Auth = {
    getUser,
    saveUser,
    isLoggedIn,
    requireLogin,
    logout,
    updateAuthUI
  };
})();
