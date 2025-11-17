// assets/auth.js
// 로그인 상태 뱃지/버튼 제어 + 로그아웃 처리

(function () {
  const $ = (s) => document.querySelector(s);
  const loginLink = $('#loginLink');
  const userBadge  = $('#userBadge');
  const logoutBtn  = $('#logoutBtn');

  async function refreshMe() {
    try {
      const r = await API.me(); // API는 assets/api.js가 전역(API)으로 노출
      const name = r?.user ?? null;

      if (name) {
        // 로그인 상태 UI
        loginLink.classList.add('hidden');
        userBadge.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        userBadge.textContent = `@${name}`;
      } else {
        // 비로그인 UI
        loginLink.classList.remove('hidden');
        userBadge.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        userBadge.textContent = '';
      }
    } catch (e) {
      // 실패 시 비로그인으로 처리
      loginLink.classList.remove('hidden');
      userBadge.classList.add('hidden');
      logoutBtn.classList.add('hidden');
      userBadge.textContent = '';
      console.warn('refreshMe failed:', e);
    }
  }

  // 로그아웃 버튼
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await API.logout();
      } finally {
        await refreshMe();
      }
    });
  }

  // 초기 1회 갱신
  refreshMe();
})();
