// assets/player_queue_playlist.js
import { API } from './api.js';

(function () {
  const url = new URL(location.href);
  const QUEUE_MODE = url.searchParams.get('queue');   // URL 파라미터에서 'queue' 값 가져오기 ('playlist'일 수도 있음)
  const PLAYLIST_ID = url.searchParams.get('plid');  // URL 파라미터에서 'plid' 가져오기 (재생목록 ID)
  const START_INDEX = parseInt(url.searchParams.get('index') || '0', 10); // 시작할 곡 인덱스, 기본 0

  if (QUEUE_MODE !== 'playlist' || !PLAYLIST_ID) {
    // 플레이리스트 모드가 아니면 함수 종료 (기존 추천 로직 유지)
    return;
  }

  // 전역 큐 상태 (플레이리스트 전용)
  let playQueue = [];      // 재생할 곡 목록 배열
  let currentIndex = 0;    // 현재 재생 중인 곡 인덱스

  // 추천 UI 숨기기 (있으면)
  const hideRecommendUI = () => {
    const suggestBtn = document.querySelector('#moreRecsBtn'); // 추천 버튼 선택
    if (suggestBtn) suggestBtn.style.display = 'none';        // 숨기기
  };

  // 사이드바 영역 선택
  const sideWrap = () =>
    document.querySelector('#recommendList') ||  // 추천 리스트 영역
    document.querySelector('#rightList') ||      // 오른쪽 리스트 영역
    document.querySelector('#sideList');         // 사이드 리스트 영역

  // 현재 재생 곡 ID 가져오기
  const currentTrackId = () => playQueue[currentIndex]?.track_id || null;

  // 특정 인덱스 곡 재생
  async function loadAndPlay(index) {
    if (index < 0 || index >= playQueue.length) return; // 유효 범위 체크
    currentIndex = index;                                // 현재 인덱스 업데이트

    // localStorage에 현재 곡 ID 저장 (기존 코드 호환용)
    localStorage.setItem('currentTrackId', currentTrackId());

    // 프로젝트에 loadTrackById 함수가 있으면 호출
    if (typeof window.loadTrackById === 'function') {
      await window.loadTrackById(currentTrackId());     // 곡 로드 및 재생
    }

    renderSidebarQueue();  // 사이드바 큐 UI 갱신
    highlightActive();     // 현재 재생 곡 강조 표시
  }

  // 다음 곡 재생
  function nextTrack() {
    if (currentIndex < playQueue.length - 1) loadAndPlay(currentIndex + 1);
  }

  // 이전 곡 재생
  function prevTrack() {
    if (currentIndex > 0) loadAndPlay(currentIndex - 1);
  }

  // 사이드바에 플레이리스트 렌더링
  function renderSidebarQueue() {
    const wrap = sideWrap(); // 사이드바 영역 선택
    if (!wrap) return;       // 영역 없으면 종료
    hideRecommendUI();       // 추천 UI 숨김

    wrap.innerHTML = '';     // 기존 내용 초기화
    playQueue.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'rec-row';  // 각 곡 행 스타일

      // 곡 썸네일, 제목, 아티스트, 소스, 재생 버튼
      row.innerHTML = `
        <div class="rec-thumb"><img src="${t.thumb || ''}" alt="thumb"/></div>
        <div class="rec-meta">
          <div class="rec-title">${t.title || ''}</div>
          <div class="rec-sub">${t.artist || ''} · ${t.source || ''}</div>
        </div>
        <button class="btn" data-role="play">재생</button>
      `;

      row.addEventListener('click', () => loadAndPlay(i)); // 클릭 시 해당 곡 재생
      wrap.appendChild(row);  // 사이드바에 추가
    });
  }

  // 현재 재생 곡 강조 표시
  function highlightActive() {
    document.querySelectorAll('.rec-row').forEach((r, i) => {
      r.classList.toggle('active', i === currentIndex); // 현재 곡이면 'active' 클래스 추가
    });
  }

  // 초기화
  async function init() {
    try {
      const pl = await API.playlistById(PLAYLIST_ID); // API로 재생목록 불러오기
      playQueue = (pl.items || []).map(it => ({
        track_id: it.track_id,  // 곡 ID
        title: it.title,        // 곡 제목
        artist: it.artist,      // 아티스트
        thumb: it.thumb,        // 썸네일
        source: it.source       // 출처
      }));

      if (!playQueue.length) {
        alert('이 재생목록에 곡이 없습니다.');
        location.href = './playlist_view.html?id=' + encodeURIComponent(PLAYLIST_ID); // 곡 없으면 재생목록 페이지로 이동
        return;
      }

      // next/prev 버튼 연결 (한 번만)
      const nextBtn = document.querySelector('#nextBtn');
      const prevBtn = document.querySelector('#prevBtn');
      if (nextBtn && !nextBtn._wired) { nextBtn._wired = true; nextBtn.addEventListener('click', nextTrack); }
      if (prevBtn && !prevBtn._wired) { prevBtn._wired = true; prevBtn.addEventListener('click', prevTrack); }

      const idx = Number.isFinite(START_INDEX)
        ? Math.min(Math.max(0, START_INDEX), playQueue.length - 1) // 범위 체크
        : 0;

      await loadAndPlay(idx); // 시작 곡 재생
    } catch (e) {
      console.warn('playlist queue load failed:', e);
      alert('재생목록을 불러오지 못했습니다.'); // 오류 처리
    }
  }

  // DOM 준비 후 init 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
