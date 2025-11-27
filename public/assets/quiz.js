// assets/quiz.js
(function () {
  const wizard = document.getElementById('wizard');
  if (!wizard) return; // 이 페이지가 아닐 때 안전 종료

  const $ = (s) => document.querySelector(s);
  const steps = Array.from(document.querySelectorAll('.step'));
  const dots = Array.from(document.querySelectorAll('[data-step-dot]'));

  // 선택 결과 저장
  const state = {
    emotion: null,     // happy / sad / angry / calm / passion
    mood: null,        // API용: happy / sad / angry / calm / energetic
    subEmotion: null,  // 외로움, 설렘 등 텍스트
    tone: null,        // boost, soothe ...
    genre: null,       // kpop / jpop / pop / rock
    nation: null,      // kr / jp / global
    color: null        // warm / cool / dark / light (-> 지금은 안 씀)
  };

  // 감정 → API의 mood 키로 매핑
  const EMOTION_TO_MOOD = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    calm: 'calm',
    passion: 'energetic'
  };

  // 상위 감정별 하위 감정 버튼 목록 (🔥 원래 쓰던 문구 그대로)
  const SUB_EMOTIONS = {
    happy: [
      '사랑이 넘친다',
      '여행 가고 싶다',
      '그냥 너무 신난다'
    ],
    sad: [
      '외로움이 크다',
      '누군가가 그립다',
      '아무것도 하기 싫다'
    ],
    angry: [
      '억울하고 답답하다',
      '짜증이 계속 난다',
      '스트레스를 풀고 싶다'
    ],
    calm: [
      '조용히 쉬고 싶다',
      '차분하게 정리하고 싶다',
      '앞으로를 생각해보고 싶다'
    ],
    passion: [
      '뭐라도 해내고 싶다',
      '열정이 폭발한다',
      '자기계발 모드 ON'
    ]
  };

  function setStep(n) {
    steps.forEach((el, idx) => {
      el.classList.toggle('hidden', idx !== n - 1);
    });
    dots.forEach((dot) => {
      dot.classList.toggle('active', Number(dot.dataset.stepDot) === n);
    });
  }

  // ────────────────────────── STEP1: 기본 감정
  $('#step1').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;

    const emo = btn.dataset.emotion;
    state.emotion = emo;
    state.mood = EMOTION_TO_MOOD[emo] || 'calm';

    // STEP2 버튼들 동적 생성
    const list = SUB_EMOTIONS[emo] || [];
    const box = $('#subEmotionContainer');
    box.innerHTML = '';
    list.forEach((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.dataset.subEmotion = label;
      b.textContent = label;
      box.appendChild(b);
    });

    $('#step2Hint').textContent =
      emo === 'happy'
        ? '좋은 일이 있었군요! 어떤 기쁨인지 골라보세요.'
        : emo === 'sad'
        ? '조금 힘든 하루였군요. 어떤 슬픔에 가까운가요?'
        : emo === 'angry'
        ? '화가 날 땐 음악으로 안전하게 풀어봐요.'
        : emo === 'calm'
        ? '차분한 하루에 어울리는 느낌을 골라보세요.'
        : '불타는 열정을 음악으로 더 끌어올려볼까요?';

    setStep(2);
  });

  // ────────────────────────── STEP2: 하위 감정
  $('#step2').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;
    state.subEmotion = btn.dataset.subEmotion || btn.textContent.trim();
    setStep(3);
  });

  // ────────────────────────── STEP3: 음악 분위기
  $('#step3').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;
    state.tone = btn.dataset.tone;
    setStep(4);
  });

  // ────────────────────────── STEP4: 장르 / 국가
  $('#step4').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;
    state.genre = btn.dataset.genre;
    state.nation = btn.dataset.nation || 'global';

    // 5단계(결과 화면)으로 이동
    setStep(5);

    // 결과 문구 업데이트 + 결과 섹션 표시
    updateResultText();
    const resultSec = document.getElementById('result');
    if (resultSec) {
      resultSec.classList.remove('hidden');
      resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ────────────────────────── STEP5: 색 / 테마 질문 제거
  // 👉 더 이상 색을 고르지 않으므로 클릭 핸들러 자체를 쓰지 않음.
  //    state.color 도 지금은 사용하지 않고, 나중에 필요하면 다시 살리면 됨.

  // 결과 문구 생성
  function updateResultText() {
    const box = $('#resultText');
    if (!box) return;

    const moodLabelMap = {
      happy: '기쁜',
      sad: '조금은 슬픈',
      angry: '화가 난',
      calm: '차분한',
      energetic: '열정적인'
    };

    const moodLabel = moodLabelMap[state.mood] || '지금';
    const genreLabel =
      state.genre === 'kpop'
        ? 'K-POP'
        : state.genre === 'jpop'
        ? 'J-POP'
        : state.genre === 'rock'
        ? '락/메탈'
        : 'POP';

    const toneLabel =
      state.tone === 'boost'
        ? '기분을 더 끌어올려 줄'
        : state.tone === 'soothe'
        ? '마음을 달래 줄'
        : state.tone === 'energy'
        ? '에너지를 채워 줄'
        : state.tone === 'breeze'
        ? '생각 없이 흘려듣기 좋은'
        : state.tone === 'focus'
        ? '집중하기 좋은'
        : '오늘의';

    box.textContent =
      `${moodLabel} 당신에게 어울리는 ` +
      `${genreLabel} 스타일의 ${toneLabel} 곡들을 추천해 드릴게요.`;
  }

  // 플레이어로 이동 (쿼리스트링에 mood/genre/nation 포함)
  $('#goPlayer').addEventListener('click', (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (state.mood) params.set('mood', state.mood);
    if (state.genre) params.set('genre', state.genre);
    if (state.nation) params.set('nation', state.nation);

    // tone, color는 나중에 쓰고 싶으면 여기에도 추가 가능
    const qs = params.toString();
    const url = qs ? `./player.html?${qs}` : './player.html';
    location.href = url;
  });

  // 처음부터 다시
  $('#restart').addEventListener('click', () => {
    state.emotion = null;
    state.mood = null;
    state.subEmotion = null;
    state.tone = null;
    state.genre = null;
    state.nation = null;
    state.color = null;

    setStep(1);
  });

  // 초기 상태
  setStep(1);
})();
