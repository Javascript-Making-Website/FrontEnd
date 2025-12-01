// assets/auth.js
(function () { 
  // 즉시 실행 함수(IIFE)로 감싸서 전역 선언을 피하고 싶어서

  const STORAGE_KEY = 'ep_user'; // 로컬스토리지에 저장할 사용자 정보의 키 이름

  // ──────────────────────────────────────────────
  // 1. 저장된 사용자 정보 가져오기
  function getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); // 저장된 JSON 문자열 읽기
      return raw ? JSON.parse(raw) : null;           // 있으면 파싱, 없으면 null 반환
    } catch (e) {
      console.warn('user parse error', e);           // JSON 오류 대비
      return null;
    }
  }

  // ──────────────────────────────────────────────
  // 2. 사용자 정보 저장 (로그인 처리)
  function saveUser(name) {
    const user = {
      name,                 // 입력받은 이름
      loggedIn: true,       // 로그인 상태를 true로 표시
      createdAt: Date.now() // 저장된 시간 기록
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); // 문자열로 변환하여 저장
    return user; // 저장한 데이터 반환
  }

  // ──────────────────────────────────────────────
  // 3. 로그아웃 기능
  function logout() {
    localStorage.removeItem(STORAGE_KEY); // 사용자 정보 삭제
    location.href = './home.html';        // 로그아웃 후 홈으로 이동
  }

  // ──────────────────────────────────────────────
  // 4. 로그인 여부 체크
  function isLoggedIn() {
    const u = getUser();            // 저장된 정보 가져오기
    return !!(u && u.loggedIn);     // 값이 있고 loggedIn이 true면 로그인 상태
  }

  // ──────────────────────────────────────────────
  // 5. 화면(UI)에서 로그인/로그아웃 HTML태크 전체를 갱신
  function updateAuthUI() {
    const user = getUser();                                // 현재 로그인 정보
    const loginLink = document.getElementById('loginLink'); // 로그인 버튼
    const userBadge = document.getElementById('userBadge'); // 사용자 이름 표시 태그
    const logoutBtn = document.getElementById('logoutBtn'); // 로그아웃 버튼

    // 페이지에 이 정보들이 없으면 UI 업데이트 스킵 로그아웃 상태
    if (!loginLink && !userBadge && !logoutBtn) return;

    // 로그인 상태일 때 UI 구성
    if (user && user.loggedIn) {
      if (loginLink) loginLink.classList.add('hidden'); // 로그인 버튼 숨김
      if (userBadge) {
        userBadge.textContent = user.name + ' 님';       // 이름 표시
        userBadge.classList.remove('hidden');           // 배지 보이기
      }
      if (logoutBtn) logoutBtn.classList.remove('hidden'); // 로그아웃 버튼 보이기

    // 로그아웃 상태일 때 UI 구성
    } else {
      if (loginLink) loginLink.classList.remove('hidden'); // 로그인 버튼 보임
      if (userBadge) userBadge.classList.add('hidden');    // 배지 숨김
      if (logoutBtn) logoutBtn.classList.add('hidden');    // 로그아웃 버튼 숨김
    }

    // 로그아웃 버튼 클릭 시 실제 로그아웃 기능 연결
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    }
  }

  // ──────────────────────────────────────────────
  // 6. 로그인 필수 페이지 접근 시 체크 후 로그인 페이지로 이동
  function requireLogin(redirectPage) {
    if (isLoggedIn()) return; // 로그인되어 있다면 그냥 통과

    let msg = '로그인 후 이용할 수 있는 메뉴입니다.'; // 기본 메시지
    if (redirectPage === 'playlist') {
      // 특정 메뉴는 안내 문구를 다르게 표시
      msg = '내 재생목록은 로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.';
    }

    alert(msg); // 알림 표시

    // 로그인 후 돌아올 페이지를 redirect 파라미터로 추가
    const qs = redirectPage
      ? '?redirect=' + encodeURIComponent(redirectPage)
      : '';

    location.href = './login.html' + qs; // 로그인 페이지로 이동
  }

  // ──────────────────────────────────────────────
  // 7. 페이지가 로딩되면 UI 갱신 + 보호 페이지라면 로그인 체크
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); // 로그인 상태에 맞춰 UI 업데이트

    const body = document.body;
    // 예: <body data-auth-required="playlist">
    if (body && body.dataset.authRequired) {
      requireLogin(body.dataset.authRequired); // 로그인 필요 시 튕기기
    }
  });

  // ──────────────────────────────────────────────
  // 8. 다른 스크립트에서도 사용할 수 있게 기능 모듈화
  window.Auth = {
    getUser,
    saveUser,
    isLoggedIn,
    requireLogin,
    logout,
    updateAuthUI
  };

})(); // 즉시 실행 함수 끝
