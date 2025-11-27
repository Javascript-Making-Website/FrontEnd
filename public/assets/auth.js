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
    // 현재 페이지에서만 처리할 수도 있지만, 홈으로 돌려보내는게 깔끔
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

    if (!loginLink && !userBadge && !logoutBtn) return; // 이 페이지에 없을 수도 있음

    if (user && user.loggedIn) {
      // 로그인 상태
      if (loginLink) loginLink.classList.add('hidden');
      if (userBadge) {
        userBadge.textContent = user.name + ' 님';
        userBadge.classList.remove('hidden');
      }
      if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
      // 비로그인 상태
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

  // 로그인 안 되어 있으면 로그인 페이지로 튕기기
  function requireLogin() {
    if (!isLoggedIn()) {
      alert('로그인 후 이용할 수 있는 메뉴입니다.');
      location.href = './login.html';
    }
  }

  // login.html 전용 세팅
  function setupLoginPage() {
    const nameEl = document.getElementById('name');
    const goBtn = document.getElementById('go');
    if (!nameEl || !goBtn) return; // 로그인 페이지가 아니면 패스

    async function doLogin() {
      const v = nameEl.value.trim();
      if (!v) {
        alert('닉네임을 입력하세요.');
        nameEl.focus();
        return;
      }

      // 여기서는 서버 호출 없이 바로 로컬 로그인 처리
      saveUser(v);
      alert(v + '님, 환영합니다!');
      location.href = './home.html';
    }

    goBtn.addEventListener('click', doLogin);
    nameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupLoginPage();
    updateAuthUI();

    // 이 페이지가 보호 대상이면 body에 data-auth-required="true" 달아놓는 방식
    const body = document.body;
    if (body && body.dataset.authRequired === 'true') {
      requireLogin();
    }
  });

  // 다른 스크립트에서 필요하면 쓸 수 있게 export
  window.Auth = {
    getUser,
    isLoggedIn,
    requireLogin,
    logout
  };
})();
