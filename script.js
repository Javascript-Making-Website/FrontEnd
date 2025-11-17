const API_KEY = 'YOUR_YOUTUBE_API_KEY';

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const recommendations = document.getElementById('recommendations');
const emotionButtons = document.querySelectorAll('#emotionButtons button');

const emotionColors = {
  '기쁨': '#FFF9C4',
  '슬픔': '#D6F0FF',
  '편안함': '#DFFFD6',
  '분노': '#FFB6B6',
  '설렘': '#FFD1E0'
};

const emotionQueries = {
  '기쁨': 'happy song',
  '슬픔': 'sad song',
  '편안함': 'relaxing music',
  '분노': 'angry music',
  '설렘': 'exciting song'
};

// 유튜브 검색 함수
function searchYouTube(query, targetDiv){
  targetDiv.innerHTML = '<p>검색 중...</p>';
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=12`)
    .then(res => res.json())
    .then(data => {
      targetDiv.innerHTML = '';
      if(!data.items || data.items.length===0){
        targetDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
      }
      data.items.forEach(item=>{
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.medium.url;

        const div = document.createElement('div');
        div.className = 'song';
        div.innerHTML = `
          <img src="${thumbnail}" alt="${title}" />
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a>
        `;
        targetDiv.appendChild(div);
      });
    })
    .catch(err=>{
      console.error(err);
      targetDiv.innerHTML = '<p>검색 중 오류가 발생했습니다.</p>';
    });
}

// 감정 버튼 클릭
emotionButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const emotion = btn.textContent;
    document.body.style.backgroundColor = emotionColors[emotion];

    emotionButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    searchYouTube(emotionQueries[emotion], recommendations);
  });
});

// 검색 버튼 클릭
searchBtn.addEventListener('click', ()=>{
  const query = searchInput.value.trim();
  if(!query){
    searchResults.innerHTML = '<p>검색어를 입력하세요.</p>';
    return;
  }
  searchYouTube(query, searchResults);
});
