// public/assets/api.js
// ─────────────────────────────────────────────────────────────────────────────
// 백엔드 연결 + 로컬 더미 폴백 지원 IIFE 버전 (window.API 전역 객체)
// ─────────────────────────────────────────────────────────────────────────────
const API = (() => {
  const BASE = 'http://localhost:3001';

  const j = (r) => (r.ok ? r.json() : r.json().then((e) => { throw e; }));
  const fx = (url, opt = {}) =>
    fetch(url, { credentials: 'include', ...opt }).then(j);

  // 감정 라벨 (백엔드/프론트 동일 키)
  const MOODS = [
    { key: 'happy',     label: '기쁨'   },
    { key: 'sad',       label: '슬픔'   },
    { key: 'calm',      label: '차분'   },
    { key: 'angry',     label: '분노'   },
    { key: 'energetic', label: '열정' },
  ];

  // ── 로컬 더미(폴백용) ──────────────────────────────────────────────────────
  let DUMMY_TRACKS = [
    {
      id: 'youtube:gdZLi9oWNZg',
      source: 'YouTube',
      title: "BTS — Dynamite",
      originalTitle: "BTS (방탄소년단) 'Dynamite' Official MV",
      artist: 'BTS',
      thumb: 'https://i.ytimg.com/vi/gdZLi9oWNZg/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=gdZLi9oWNZg',
      moods: ['happy','energetic'],
      genre: 'kpop',
      nation: 'kr'
    },
    {
      id: 'youtube:6eEZ7DJMzuk',
      source: 'YouTube',
      title: 'IVE — LOVE DIVE',
      originalTitle: "IVE 아이브 'LOVE DIVE' MV",
      artist: 'IVE',
      thumb: 'https://i.ytimg.com/vi/6eEZ7DJMzuk/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=6eEZ7DJMzuk',
      moods: ['happy','energetic'],
      genre: 'kpop',
      nation: 'kr'
    },
    {
      id: 'youtube:TQ8WlA2GXbk',
      source: 'YouTube',
      title: 'Official髭男dism — Pretender',
      originalTitle: 'Official髭男dism - Pretender [Official Video]',
      artist: 'Official髭男dism',
      thumb: 'https://i.ytimg.com/vi/TQ8WlA2GXbk/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=TQ8WlA2GXbk',
      moods: ['sad','calm'],
      genre: 'jpop',
      nation: 'jp'
    },
    {
      id: 'youtube:Q6iK6DjV_iE',
      source: 'YouTube',
      title: 'YOASOBI — 夜に駆ける',
      originalTitle: 'YOASOBI「夜に駆ける」Official Music Video',
      artist: 'YOASOBI',
      thumb: 'https://i.ytimg.com/vi/Q6iK6DjV_iE/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=Q6iK6DjV_iE',
      moods: ['energetic'],
      genre: 'jpop',
      nation: 'jp'
    },
    {
      id: 'youtube:8xg3vE8Ie_E',
      source: 'YouTube',
      title: 'Taylor Swift — Love Story',
      originalTitle: 'Taylor Swift - Love Story',
      artist: 'Taylor Swift',
      thumb: 'https://i.ytimg.com/vi/8xg3vE8Ie_E/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=8xg3vE8Ie_E',
      moods: ['happy','calm'],
      genre: 'pop',
      nation: 'us'
    },
    {
      id: 'youtube:RBumgq5yVrA',
      source: 'YouTube',
      title: 'Ed Sheeran — Photograph',
      originalTitle: 'Ed Sheeran - Photograph (Official Music Video)',
      artist: 'Ed Sheeran',
      thumb: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=RBumgq5yVrA',
      moods: ['sad','calm'],
      genre: 'pop',
      nation: 'uk'
    },
    {
      id: 'youtube:OPf0YbXqDm0',
      source: 'YouTube',
      title: 'Mark Ronson — Uptown Funk (feat. Bruno Mars)',
      originalTitle: 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars',
      artist: 'Mark Ronson',
      thumb: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=OPf0YbXqDm0',
      moods: ['energetic','happy'],
      genre: 'pop',
      nation: 'us'
    },
    {
      id: 'youtube:d9h2oQxQv0c',
      source: 'YouTube',
      title: 'IU — Palette (feat. G-DRAGON)',
      originalTitle: 'IU(아이유) _ Palette(팔레트) (Feat. G-DRAGON) MV',
      artist: 'IU',
      thumb: 'https://i.ytimg.com/vi/d9h2oQxQv0c/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=d9h2oQxQv0c',
      moods: ['calm','happy'],
      genre: 'kpop',
      nation: 'kr'
    },
    {
      id: 'youtube:pXRviuL6vMY',
      source: 'YouTube',
      title: 'twenty one pilots — Stressed Out',
      originalTitle: 'twenty one pilots: Stressed Out [OFFICIAL VIDEO]',
      artist: 'twenty one pilots',
      thumb: 'https://i.ytimg.com/vi/pXRviuL6vMY/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=pXRviuL6vMY',
      moods: ['angry','sad'],
      genre: 'rock',
      nation: 'us'
    },
    {
      id: 'youtube:tAGnKpE4NCI',
      source: 'YouTube',
      title: 'Metallica — Nothing Else Matters',
      originalTitle: 'Metallica: Nothing Else Matters (Official Music Video)',
      artist: 'Metallica',
      thumb: 'https://i.ytimg.com/vi/tAGnKpE4NCI/hqdefault.jpg',
      url:   'https://www.youtube.com/watch?v=tAGnKpE4NCI',
      moods: ['calm','sad'],
      genre: 'rock',
      nation: 'us'
    }
  ];

  const cleanTitle = (s) =>
    (s || '')
      .replace(/\s*\[[^\]]*\]\s*/g, ' ')
      .replace(/\s*\([^\)]*\)\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

  function list() { return [...DUMMY_TRACKS]; }

  function searchLocal(q) {
    if (!q) return list();
    const t = q.toLowerCase();
    return DUMMY_TRACKS.filter(v =>
      v.title.toLowerCase().includes(t) ||
      (v.originalTitle || '').toLowerCase().includes(t) ||
      v.artist.toLowerCase().includes(t)
    );
  }

  // ── 백엔드 API (우선 사용) ────────────────────────────────────────────────
  async function me() {
    try { return await fx(`${BASE}/api/me`); }
    catch { return { user: null }; }
  }

  async function login({ username, password }) {
    return fx(`${BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  }

  async function logout() {
    return fx(`${BASE}/api/logout`, { method: 'POST' });
  }

  // ★ pageToken 지원 검색
  async function search({ q, mood, genre, nation, pageToken } = {}) {
    try {
      const u = new URL(`${BASE}/api/search`);
      if (q) u.searchParams.set('q', q);
      if (mood) u.searchParams.set('mood', mood);
      if (genre) u.searchParams.set('genre', genre);
      if (nation) u.searchParams.set('nation', nation);
      if (pageToken) u.searchParams.set('pageToken', pageToken);

      return await fx(u); // { items, nextPageToken }
    } catch {
      // 폴백: 로컬 더미 (페이지네이션 X)
      const items = searchLocal(q);
      const filtered = mood ? items.filter(t => t.moods?.includes(mood)) : items;
      return { items: filtered, nextPageToken: null };
    }
  }

  async function recs({ mood, genre, nation, sub, tone } = {}) {
    try {
      const u = new URL(`${BASE}/api/recs`);
      if (mood) u.searchParams.set('mood', mood);
      if (genre) u.searchParams.set('genre', genre);
      if (nation) u.searchParams.set('nation', nation);
      if (sub)    u.searchParams.set('sub', sub);
      if (tone)   u.searchParams.set('tone',   tone);
      return await fx(u);
    } catch {
      // 폴백: 로컬 더미에서 mood 위주로 정렬
      const score = (t) =>
        (mood && t.moods?.includes(mood) ? 2 : 0) +
        (/official|mv|audio/i.test(t.originalTitle || t.original_title || '') ? 0.5 : 0);
      const items = [...DUMMY_TRACKS].sort((a, b) => score(b) - score(a)).slice(0, 20);
      return { items };
    }
  }

  async function rate(trackId, mood) {
    try {
      return await fx(`${BASE}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, mood })
      });
    } catch {
      Ratings.setMood(trackId, mood);
      return { ok: true, fallback: true };
    }
  }

  async function watch(trackId) {
    try {
      return await fx(`${BASE}/api/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId })
      });
    } catch {
      return { ok: true, fallback: true };
    }
  }
  

  // ✅ 내 재생목록 목록 (likes / liked / items 포함)
  async function playlists() {
    try {
      return await fx(`${BASE}/api/playlists`);
    } catch {
      return { items: [{ id: 0, title: 'Local Playlist', is_public: 0, items: Playlist.get(), likes: 0, liked: false }] };
    }
  }

  // ✅ 재생목록 생성
  async function createPlaylist({ title, isPublic, themeColor }) {
    try {
      return await fx(`${BASE}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          isPublic,
          // 색을 안 넘겼으면 기본색 사용
          themeColor: themeColor || '#22d3ee'
        })
      });
    } catch {
      // 서버 죽었을 때라도 UI 안터지게 하는 기존 폴백 유지
      return { ok: true, id: 0, fallback: true };
    }
  }


  // ✅ 재생목록 삭제
  async function deletePlaylist(id) {
    try {
      return await fx(`${BASE}/api/playlists/${id}`, {
        method: 'DELETE'
      });
    } catch {
      // 폴백: 로컬 재생목록 싹 비우는 정도만
      Playlist.set([]);
      return { ok: true, fallback: true };
    }
  }


  // ✅ 재생목록에 곡 추가
  async function addToPlaylist({ playlistId, trackId, position = 0 }) {
    try {
      return await fx(`${BASE}/api/playlist/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId, trackId, position })
      });
    } catch {
      const t = list().find(x => x.id === trackId);
      if (t) Playlist.add(t);
      return { ok: true, fallback: true };
    }
  }

  // ✅ 재생목록에서 곡 제거
  async function removeFromPlaylist({ playlistId, trackId }) {
    try {
      return await fx(`${BASE}/api/playlist/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId, trackId })
      });
    } catch {
      Playlist.remove(trackId);
      return { ok: true, fallback: true };
    }
  }

  // ⭐ 특정 재생목록 상세 (player에서 사용 예정)
  async function playlistDetail(id) {
    try {
      return await fx(`${BASE}/api/playlists/${id}`);
    } catch {
      // 폴백: 로컬 재생목록을 한 개짜리 가짜 playlist라고 생각
      return {
        id: 0,
        title: 'Local Playlist',
        is_public: 0,
        likes: 0,
        owner_name: 'local',
        items: Playlist.get()
      };
    }
  }

  // ⭐ 재생목록 좋아요 토글
  async function togglePlaylistLike(id) {
    try {
      return await fx(`${BASE}/api/playlists/${id}/like`, {
        method: 'POST'
      });
    } catch {
      // 폴백: 로컬에서는 좋아요 상태를 굳이 저장 안 해도 됨
      return { ok: true, liked: true, likes: 0, fallback: true };
    }
  }

  // ✅ 공개 재생목록 목록 (최근 / 인기)
  //    API.publicPlaylists({ sort: 'recent' | 'popular', limit })
  async function publicPlaylists({ sort = 'recent', limit = 20 } = {}) {
    try {
      const u = new URL(`${BASE}/api/playlists/public`);
      if (sort) u.searchParams.set('sort', sort);
      if (limit) u.searchParams.set('limit', String(limit));
      return await fx(u);
    } catch {
      return { items: [] };
    }
  }

  // ── localStorage 기반 (폴백용) ────────────────────────────────────────────
  const Auth = {
    user() {
      try { return JSON.parse(localStorage.getItem('auth.user') || 'null'); }
      catch { return null; }
    },
    setUser(name) {
      localStorage.setItem('auth.user', JSON.stringify({ name }));
    },
    playlistKey() {
      const u = Auth.user(); return u ? `playlist:${u.name}` : null;
    },
    ratingKey() {
      const u = Auth.user(); return u ? `ratings:${u.name}` : null;
    },
  };

  const Playlist = {
    get(){
      const k = Auth.playlistKey(); if(!k) return [];
      try{ return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; }
    },
    set(list){
      const k = Auth.playlistKey(); if(!k) return;
      localStorage.setItem(k, JSON.stringify(list));
    },
    add(track){
      const list = Playlist.get();
      if(!list.find(t=>t.id===track.id)){ list.push(track); Playlist.set(list); }
    },
    remove(id){
      const list = Playlist.get().filter(t=>t.id!==id); Playlist.set(list);
    }
  };

  const Ratings = {
    get(){
      const k = Auth.ratingKey(); if(!k) return {};
      try{ return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; }
    },
    set(map){
      const k = Auth.ratingKey(); if(!k) return;
      localStorage.setItem(k, JSON.stringify(map));
    },
    setMood(trackId, mood){
      const m = Ratings.get(); m[trackId] = mood; Ratings.set(m);
    }
  };

  return {
    MOODS, cleanTitle,
    list, searchLocal, Playlist, Ratings,
    me, login, logout,
    search, recs, rate, watch,
    playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist,
    playlistDetail, togglePlaylistLike,
    publicPlaylists,
    playlistById: playlistDetail,
  };
})();
