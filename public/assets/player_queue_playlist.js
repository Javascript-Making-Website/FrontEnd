// assets/player_queue_playlist.js
import { API } from './api.js';

(function () {
  const url = new URL(location.href);
  const QUEUE_MODE = url.searchParams.get('queue');   // 'playlist' | null
  const PLAYLIST_ID = url.searchParams.get('plid');
  const START_INDEX = parseInt(url.searchParams.get('index') || '0', 10);

  if (QUEUE_MODE !== 'playlist' || !PLAYLIST_ID) {
    // 플레이리스트 모드가 아닐 때는 아무것도 안 함 (기존 추천 로직 그대로)
    return;
  }

  // 전역 큐 상태 (플레이리스트 전용)
  let playQueue = [];
  let currentIndex = 0;

  // 이미 추천 UI가 그려졌다면 숨김(있을 때만)
  const hideRecommendUI = () => {
    const suggestBtn = document.querySelector('#moreRecsBtn');
    if (suggestBtn) suggestBtn.style.display = 'none';
  };

  const sideWrap = () =>
    document.querySelector('#recommendList') ||
    document.querySelector('#rightList') ||
    document.querySelector('#sideList');

  const currentTrackId = () => playQueue[currentIndex]?.track_id || null;

  async function loadAndPlay(index) {
    if (index < 0 || index >= playQueue.length) return;
    currentIndex = index;

    // 기존 코드가 localStorage('currentTrackId')를 읽는 경우 맞춰줌
    localStorage.setItem('currentTrackId', currentTrackId());

    // 프로젝트에 이미 있는 로더 함수 호출(있으면)
    if (typeof window.loadTrackById === 'function') {
      await window.loadTrackById(currentTrackId());
    }

    renderSidebarQueue();
    highlightActive();
  }

  function nextTrack() {
    if (currentIndex < playQueue.length - 1) loadAndPlay(currentIndex + 1);
  }
  function prevTrack() {
    if (currentIndex > 0) loadAndPlay(currentIndex - 1);
  }

  function renderSidebarQueue() {
    const wrap = sideWrap();
    if (!wrap) return;
    hideRecommendUI();

    wrap.innerHTML = '';
    playQueue.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'rec-row';
      row.innerHTML = `
        <div class="rec-thumb"><img src="${t.thumb || ''}" alt="thumb"/></div>
        <div class="rec-meta">
          <div class="rec-title">${t.title || ''}</div>
          <div class="rec-sub">${t.artist || ''} · ${t.source || ''}</div>
        </div>
        <button class="btn" data-role="play">재생</button>
      `;
      row.addEventListener('click', () => loadAndPlay(i));
      wrap.appendChild(row);
    });
  }

  function highlightActive() {
    document.querySelectorAll('.rec-row').forEach((r, i) => {
      r.classList.toggle('active', i === currentIndex);
    });
  }

  async function init() {
    try {
      const pl = await API.playlistById(PLAYLIST_ID);
      playQueue = (pl.items || []).map(it => ({
        track_id: it.track_id,
        title: it.title,
        artist: it.artist,
        thumb: it.thumb,
        source: it.source
      }));

      if (!playQueue.length) {
        alert('이 재생목록에 곡이 없습니다.');
        location.href = './playlist_view.html?id=' + encodeURIComponent(PLAYLIST_ID);
        return;
      }

      // next/prev 버튼이 있다면 연결(있을 때만 동작)
      const nextBtn = document.querySelector('#nextBtn');
      const prevBtn = document.querySelector('#prevBtn');
      if (nextBtn && !nextBtn._wired) { nextBtn._wired = true; nextBtn.addEventListener('click', nextTrack); }
      if (prevBtn && !prevBtn._wired) { prevBtn._wired = true; prevBtn.addEventListener('click', prevTrack); }

      const idx = Number.isFinite(START_INDEX)
        ? Math.min(Math.max(0, START_INDEX), playQueue.length - 1)
        : 0;

      await loadAndPlay(idx);
    } catch (e) {
      console.warn('playlist queue load failed:', e);
      alert('재생목록을 불러오지 못했습니다.');
    }
  }

  // DOM 준비 후 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
