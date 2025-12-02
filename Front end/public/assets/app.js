// assets/app.js
// 공통 UI + 로그인 상태 관리

import { API } from './api.js';

// 감정 목록은 API 쪽에서 그대로 사용
export const MOODS = API.MOODS;

// ───────────────────────────────────────
//  AuthUI : 로그인 상태 + 헤더 동기화
// ───────────────────────────────────────
export const AuthUI = {
  user: null,

  // 서버에 로그인 여부 물어보고 헤더 버튼/뱃지 업데이트
  async sync() {
    let name = null;
    try {
      const r = await API.me();
      name = r?.user ?? null;
    } catch {
      name = null;
    }
    this.user = name;

    const loginLink = document.getElementById('loginLink');
    const userBadge = document.getElementById('userBadge');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginLink && userBadge && logoutBtn) {
      if (name) {
        // 로그인 상태
        loginLink.classList.add('hidden');
        userBadge.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        userBadge.textContent = `@${name}`;
      } else {
        // 비로그인 상태
        loginLink.classList.remove('hidden');
        userBadge.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        userBadge.textContent = '';
      }
    }

    // 로그아웃 버튼 동작
    if (logoutBtn && !logoutBtn._wired) {
      logoutBtn._wired = true;
      logoutBtn.addEventListener('click', async () => {
        try {
          await API.logout();
        } catch {}
        this.user = null;
        await this.sync();
      });
    }

    return !!name;
  },

  /**
   * 로그인 필요한 기능에서만 사용하는 헬퍼
   * - 로그인 안돼 있으면 "로그인 후 이용 가능한 기능입니다."만 띄우고 끝.
   * - redirect 옵션을 true로 주면 login.html로 보내고 싶을 때만 사용.
   */
  async gate(fn, { redirect = false } = {}) {
    const ok = await this.sync();
    if (!ok) {
      alert('로그인 후 이용 가능한 기능입니다.');
      if (redirect) {
        location.href = './login.html';
      }
      return;
    }
    return fn();
  }
};

// ───────────────────────────────────────
//  감정 칩 렌더링 (player / search 등에서 사용)
// ───────────────────────────────────────
export function renderMoodChips() {
  const box = document.getElementById('moodChips');
  if (!box) return;

  const active = document.body.getAttribute('data-mood') || 'calm';
  box.innerHTML = '';

  MOODS.forEach((m) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (m.key === active ? ' active' : '');
    b.textContent = m.label;
    b.onclick = () => {
      document.body.setAttribute('data-mood', m.key);
      // 다른 코드에서 감정 바뀜을 감지할 수 있도록 커스텀 이벤트 발행
      const ev = new CustomEvent('moodchange', { detail: { mood: m.key } });
      box.dispatchEvent(ev);
    };
    box.appendChild(b);
  });
}
