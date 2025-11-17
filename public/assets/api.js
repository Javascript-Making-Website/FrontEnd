// public/assets/api.js
// ─────────────────────────────────────────────────────────────────────────────
// 백엔드 연결 + 로컬 더미 폴백 지원 IIFE 버전 (window.API 전역 객체)
// ─────────────────────────────────────────────────────────────────────────────
const API = (() => {
  // 백엔드 주소 (개발용)
  const BASE = 'http://localhost:3001';

  // 공용 fetch JSON 헬퍼 (쿠키 포함)
  const j = (r) => (r.ok ? r.json() : r.json().then((e) => { throw e; }));
  const fx = (url, opt = {}) =>
    fetch(url, { credentials: 'include', ...opt }).then(j);

  // 감정 라벨 (백엔드/프론트 동일 키)
  const MOODS = [
    { key: 'happy',     label: '기쁨'   },
    { key: 'sad',       label: '슬픔'   },
    { key: 'calm',      label: '차분'   },
    { key: 'angry',     label: '분노'   },
    { key: 'energetic', label: '에너지' },
  ];

  // ── 로컬 더미(폴백용) ──────────────────────────────────────────────────────
  let DUMMY_TRACKS = [
    { id:'youtube:dQw4w9WgXcQ', source:'YouTube', title:'Rick Astley — Never Gonna Give You Up', originalTitle:'Rick Astley - Never Gonna Give You Up (Official Music Video)', artist:'Rick Astley', thumb:'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', moods:['energetic','happy'] },
    { id:'youtube:ktvTqknDobU', source:'YouTube', title:'Queen — Bohemian Rhapsody', originalTitle:'Queen – Bohemian Rhapsody (Official Video Remastered)', artist:'Queen', thumb:'https://i.ytimg.com/vi/ktvTqknDobU/hqdefault.jpg', url:'https://www.youtube.com/watch?v=ktvTqknDobU', moods:['energetic','sad'] },
    { id:'youtube:Zi_XLOBDo_Y', source:'YouTube', title:'Adele — Someone Like You', originalTitle:'Adele - Someone Like You (Official Music Video)', artist:'Adele', thumb:'https://i.ytimg.com/vi/Zi_XLOBDo_Y/hqdefault.jpg', url:'https://www.youtube.com/watch?v=Zi_XLOBDo_Y', moods:['sad','calm'] },
    { id:'youtube:fLexgOxsZu0', source:'YouTube', title:'Pharrell Williams — Happy', originalTitle:'Pharrell Williams - Happy (Official Music Video)', artist:'Pharrell Williams', thumb:'https://i.ytimg.com/vi/fLexgOxsZu0/hqdefault.jpg', url:'https://www.youtube.com/watch?v=fLexgOxsZu0', moods:['happy','energetic'] },
    { id:'youtube:V1Pl8CzNzCw', source:'YouTube', title:'Billie Eilish — bad guy', originalTitle:'Billie Eilish - bad guy', artist:'Billie Eilish', thumb:'https://i.ytimg.com/vi/V1Pl8CzNzCw/hqdefault.jpg', url:'https://www.youtube.com/watch?v=V1Pl8CzNzCw', moods:['angry','energetic'] },
    { id:'youtube:RBumgq5yVrA', source:'YouTube', title:'Ed Sheeran — Photograph', originalTitle:'Ed Sheeran - Photograph (Official Music Video)', artist:'Ed Sheeran', thumb:'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg', url:'https://www.youtube.com/watch?v=RBumgq5yVrA', moods:['calm','sad'] },
    { id:'youtube:OPf0YbXqDm0', source:'YouTube', title:'Mark Ronson — Uptown Funk (feat. Bruno Mars)', originalTitle:'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars', artist:'Mark Ronson', thumb:'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg', url:'https://www.youtube.com/watch?v=OPf0YbXqDm0', moods:['energetic','happy'] },
    { id:'youtube:hLQl3WQQoQ0', source:'YouTube', title:'Adele — Someone Like You (Live at The BRIT Awards 2011)', originalTitle:'Adele - Someone Like You (BRIT Awards 2011) Performance', artist:'Adele', thumb:'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg', url:'https://www.youtube.com/watch?v=hLQl3WQQoQ0', moods:['sad'] },
    { id:'youtube:pXRviuL6vMY', source:'YouTube', title:'twenty one pilots — Stressed Out', originalTitle:'twenty one pilots: Stressed Out [OFFICIAL VIDEO]', artist:'twenty one pilots', thumb:'https://i.ytimg.com/vi/pXRviuL6vMY/hqdefault.jpg', url:'https://www.youtube.com/watch?v=pXRviuL6vMY', moods:['angry','sad'] },
    { id:'youtube:ktvTqknDobU-lyric', source:'YouTube', title:'Queen — Bohemian Rhapsody (Lyrics)', originalTitle:'Queen - Bohemian Rhapsody (Lyrics)', artist:'Queen', thumb:'https://i.ytimg.com/vi/ktvTqknDobU/hqdefault.jpg', url:'https://www.youtube.com/watch?v=ktvTqknDobU', moods:['calm'] }
  ];

  const cleanTitle = (s) =>
    s.replace(/\s*\[[^\]]*\]\s*/g, ' ')
     .replace(/\s*\([^\)]*\)\s*/g, ' ')
     .replace(/\s{2,}/g, ' ')
     .trim();

  function list() { return [...DUMMY_TRACKS]; }

  function searchLocal(q) {
    if (!q) return list();
    const t = q.toLowerCase();
    return DUMMY_TRACKS.filter(v =>
      v.title.toLowerCase().includes(t) ||
      v.originalTitle.toLowerCase().includes(t) ||
      v.artist.toLowerCase().includes(t)
    );
  }

  // ── 백엔드 API (우선 사용) ────────────────────────────────────────────────
  // 실패 시 로컬 더미로 폴백하도록 try/catch 처리
  async function me() {
    try { return await fx(`${BASE}/api/me`); }
    catch { return { user: null }; }
  }

  async function login(name) {
    return fx(`${BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  }

  async function logout() {
    return fx(`${BASE}/api/logout`, { method: 'POST' });
  }

  async function search({ q, mood } = {}) {
    try {
      const u = new URL(`${BASE}/api/search`);
      if (q) u.searchParams.set('q', q);
      if (mood) u.searchParams.set('mood', mood);
      return await fx(u);
    } catch {
      // 폴백: 로컬 더미
      const items = searchLocal(q);
      return { items: mood ? items.filter(t => t.moods?.includes(mood)) : items };
    }
  }

  async function recs(mood) {
    try {
      const u = new URL(`${BASE}/api/recs`);
      if (mood) u.searchParams.set('mood', mood);
      return await fx(u);
    } catch {
      // 폴백: 로컬 더미에서 mood 정렬
      const score = (t) => (mood && t.moods?.includes(mood) ? 2 : 0)
        + (/official|mv|audio/i.test(t.originalTitle) ? 0.5 : 0);
      const items = [...DUMMY_TRACKS].sort((a,b)=>score(b)-score(a)).slice(0,20);
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
      // 폴백: 로컬 저장
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

  async function playlists() {
    try { return await fx(`${BASE}/api/playlists`); }
    catch {
      // 폴백: 로컬 플레이리스트를 백엔드 형태 흉내
      return { items: [{ id: 0, title: 'Local Playlist', is_public: 0, items: Playlist.get() }] };
    }
  }

  async function createPlaylist({ title, isPublic }) {
    try {
      return await fx(`${BASE}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, isPublic })
      });
    } catch {
      // 폴백: 로컬은 단일 목록만 유지
      return { ok: true, id: 0, fallback: true };
    }
  }

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

  async function publicPlaylists() {
    try { return await fx(`${BASE}/api/playlists/public`); }
    catch { return { items: [] }; }
  }

  // ── localStorage 기반 (예전 API 유지: 폴백/오프라인 용) ────────────────
  const Auth = {
    user() {
      // 단순 확인용 (백엔드 쿠키와는 별개)
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

  // ── 공개 API ─────────────────────────────────────────────────────────────
  return {
    // 상수/유틸
    MOODS, cleanTitle,

    // 로컬 더미(이전 호환/폴백)
    list, searchLocal, Playlist, Ratings,

    // 백엔드 연동
    me, login, logout,
    search, recs, rate, watch,
    playlists, createPlaylist, addToPlaylist, removeFromPlaylist,
    publicPlaylists,
  };
})();
