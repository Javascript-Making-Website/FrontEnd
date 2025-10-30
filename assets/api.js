const API = (() => {
  const MOODS = [
    { key: 'happy',     label: '기쁨'   },
    { key: 'sad',       label: '슬픔'   },
    { key: 'calm',      label: '차분'   },
    { key: 'angry',     label: '분노'   },
    { key: 'energetic', label: '에너지' },
  ];

  // 더미 데이터 (원하면 data/songs.json으로 분리 가능)
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

  function searchLocal(q){
    if (!q) return list();
    const t = q.toLowerCase();
    return DUMMY_TRACKS.filter(v =>
      v.title.toLowerCase().includes(t) ||
      v.originalTitle.toLowerCase().includes(t) ||
      v.artist.toLowerCase().includes(t)
    );
  }

  function list(){ return [...DUMMY_TRACKS]; }

  // localStorage 기반 재생목록/라벨
  const Playlist = {
    get(){ const k = Auth.playlistKey(); if(!k) return []; try{ return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
    set(list){ const k = Auth.playlistKey(); if(!k) return; localStorage.setItem(k, JSON.stringify(list)); },
    add(track){ const list = Playlist.get(); if(!list.find(t=>t.id===track.id)){ list.push(track); Playlist.set(list); } },
    remove(id){ const list = Playlist.get().filter(t=>t.id!==id); Playlist.set(list); }
  };

  const Ratings = {
    get(){ const k = Auth.ratingKey(); if(!k) return {}; try{ return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } },
    set(map){ const k = Auth.ratingKey(); if(!k) return; localStorage.setItem(k, JSON.stringify(map)); },
    setMood(trackId, mood){ const m = Ratings.get(); m[trackId] = mood; Ratings.set(m); }
  };

  return { MOODS, list, searchLocal, cleanTitle, Playlist, Ratings };
})();
