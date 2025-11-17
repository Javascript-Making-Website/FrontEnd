let ytPlayer = null; // YouTube player
let currentTrack = null;

// YouTube IFrame API 콜백 (index.html에서만 DOM이 있음)
window.onYouTubeIframeAPIReady = function(){
  const el = document.getElementById('player');
  if (!el) return; // 다른 페이지면 패스
  ytPlayer = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
    events: { onReady: onPlayerReady }
  });
};

function onPlayerReady(){
  const savedId = localStorage.getItem('currentTrackId');
  const t = (savedId && API.list().find(x => x.id === savedId)) || API.list()[0];
  if (t) loadTrack(t);
}

function loadTrack(track){
  currentTrack = track;
  localStorage.setItem('currentTrackId', track.id);
  const videoId = track.id.split(':')[1];
  if (ytPlayer && ytPlayer.loadVideoById) ytPlayer.loadVideoById(videoId);

  const nowThumb = document.getElementById('nowThumb'); if (nowThumb) nowThumb.src = track.thumb;
  const nowTitle = document.getElementById('nowTitle'); if (nowTitle) nowTitle.textContent = API.cleanTitle(track.title);
  const nowSub   = document.getElementById('nowSub');   if (nowSub)   nowSub.textContent   = `${track.artist} · ${track.originalTitle}`;
  const nowSrc   = document.getElementById('nowSource');if (nowSrc)   nowSrc.textContent   = track.source;
  const openOnYT = document.getElementById('openOnYT'); if (openOnYT) openOnYT.href        = track.url;

  renderRateChips();
}

function renderRateChips(){
  const box = document.getElementById('rateMoods');
  if (!box) return;
  box.innerHTML = '';
  API.MOODS.forEach(m => {
    const el = document.createElement('button');
    el.className = 'chip';
    el.textContent = m.label;
    el.onclick = () => {
      if (!Auth.user) return alert('로그인 후 라벨을 저장할 수 있어요.');
      API.Ratings.setMood(currentTrack.id, m.key);
      alert(`이 곡에 "${m.label}" 라벨을 저장했습니다.`);
      setMood(m.key);
      renderRecs();
    };
    box.appendChild(el);
  });
}

function renderMoodChips(){
  const holder = document.getElementById('moodChips');
  if (!holder) return;
  holder.innerHTML = '';
  const active = document.body.getAttribute('data-mood') || 'calm';
  API.MOODS.forEach(m => {
    const b = document.createElement('button');
    b.className = 'chip' + (active === m.key ? ' active' : '');
    b.textContent = m.label;
    b.onclick = () => { setMood(m.key); renderRecs(); };
    holder.appendChild(b);
  });
}

function setMood(key){
  document.body.setAttribute('data-mood', key);
  renderMoodChips();
}

function sortedTracks(){
  const activeMood = document.body.getAttribute('data-mood');
  const rates = API.Ratings.get();
  return [...API.list()].sort((a, b) => {
    const score = (t) => {
      let s = 0;
      if (t.moods?.includes(activeMood)) s += 2;
      if (rates[t.id] === activeMood) s += 3;
      if (/official|mv|audio/i.test(t.originalTitle)) s += 0.5;
      return s;
    };
    return score(b) - score(a);
  });
}

function itemEl(track, opts = {}){
  const el = document.createElement('div');
  el.className = 'item';
  el.innerHTML = `
    <img src="${track.thumb}" alt="thumb" />
    <div>
      <div class="t">${API.cleanTitle(track.title)}</div>
      <div class="s">${track.artist} · <span class="badge">${track.source}</span></div>
    </div>
    ${opts.controls ? '<div style="display:flex;gap:6px;">' + opts.controls + '</div>' : ''}
  `;
  el.onclick = (e) => {
    if (e.target && e.target.closest('button')) return; // 버튼 클릭은 제외
    loadTrack(track);
  };
  return el;
}

function renderRecs(){
  const holder = document.getElementById('recList');
  if (!holder) return;
  holder.innerHTML = '';
  sortedTracks().forEach(t => holder.appendChild(itemEl(t)));
}

// Controls & header sync
function wireControls(){
  const playBtn  = document.getElementById('playBtn');  if (playBtn)  playBtn.onclick  = () => { try { ytPlayer.playVideo(); } catch {} };
  const pauseBtn = document.getElementById('pauseBtn'); if (pauseBtn) pauseBtn.onclick = () => { try { ytPlayer.pauseVideo(); } catch {} };
  const addBtn   = document.getElementById('addToPlaylistBtn');
  if (addBtn) addBtn.onclick = () => {
    if (!Auth.user) return alert('로그인 후 재생목록을 사용할 수 있어요.');
    if (currentTrack) API.Playlist.add(currentTrack);
    alert('재생목록에 추가했습니다.');
  };
}

// 페이지 공통 초기화
(function init(){
  renderMoodChips();
  renderRecs();
  wireControls();
})();
