// assets/quiz.js
(function () {
  const wizard = document.getElementById('wizard');
  if (!wizard) return; // 이 페이지가 아닐 때 안전 종료

  const $ = (s) => document.querySelector(s);
  const steps = Array.from(document.querySelectorAll('.step'));
  const dots = Array.from(document.querySelectorAll('[data-step-dot]'));

  const trailBox = document.getElementById('emotionTrail');

  // ────────────────────────── 이모지 트레일 헬퍼 ──────────────────────────
  function addTrailIcon(icon) {
    if (!trailBox || !icon) return;
    const span = document.createElement('span');
    span.className = 'trail-icon';
    span.textContent = icon;
    trailBox.appendChild(span);
  }

  function clearTrail() {
    if (!trailBox) return;
    trailBox.innerHTML = '';
  }

  // 선택 결과 저장
  const state = {
    emotion: null,     // happy / sad / angry / calm / passion
    mood: null,        // API용: happy / sad / angry / calm / energetic
    subEmotion: null,  // 외로움, 설렘 등 텍스트
    subKey: null,
    tone: null,        // boost, soothe ...
    genre: null,       // kpop / jpop / pop / rock
    nation: null,      // kr / jp / global
    color: null        // warm / cool / dark / light (-> 지금은 안 씀)
  };

  let currentStep = 1;

  // 감정 → API의 mood 키로 매핑
  const EMOTION_TO_MOOD = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    calm: 'calm',
    passion: 'energetic'
  };

  // 상위 감정별 하위 감정 버튼 목록 + 아이콘
  const SUB_EMOTIONS = {
    happy: [
      { key: 'in_love',   label: '사랑이 넘친다',             icon: '💖' },
      { key: 'travel',    label: '여행 가고 싶다',           icon: '✈️' },
      { key: 'excited',   label: '그냥 너무 신난다',         icon: '🎉' }
    ],
    sad: [
      { key: 'lonely',    label: '외로움이 크다',            icon: '😔' },
      { key: 'missing',   label: '누군가가 그립다',          icon: '😢' },
      { key: 'drained',   label: '아무것도 하기 싫다',       icon: '🥱' }
    ],
    angry: [
      { key: 'unfair',    label: '억울하고 답답하다',         icon: '😤' },
      { key: 'annoyed',   label: '짜증이 계속 난다',         icon: '😡' },
      { key: 'rage',      label: '스트레스를 풀고 싶다',     icon: '💢' }
    ],
    calm: [
      { key: 'rest',      label: '조용히 쉬고 싶다',         icon: '🛌' },
      { key: 'organize',  label: '차분하게 정리하고 싶다',   icon: '🧹' },
      { key: 'reflect',   label: '앞으로를 생각해보고 싶다', icon: '🧠' }
    ],
    passion: [
      { key: 'achieve',   label: '뭐라도 해내고 싶다',       icon: '🏃‍♂️' },
      { key: 'explosion', label: '열정이 폭발한다',          icon: '🔥' },
      { key: 'selfdev',   label: '자기계발 모드 ON',         icon: '📚' }
    ]
  };

  // 1단계 감정 아이콘
  const EMOTION_ICONS = {
    happy:   '😊',
    sad:     '😢',
    angry:   '😡',
    calm:    '🌿',
    passion: '🔥'
  };

  // 이모지 트레일 전체 매핑
  const EMOJI_TRAIL_MAP = {
    // 1단계: 감정
    emotion: EMOTION_ICONS,

    // 2단계: 세부 감정 (subKey → icon)
    sub: (function () {
      const map = {};
      Object.values(SUB_EMOTIONS).forEach(list => {
        list.forEach(({ key, icon }) => {
          map[key] = icon;
        });
      });
      return map;
    })(),

    // 3단계: 분위기 (tone)
    tone: {
      boost:  '\u{1F3B6}', // 🎶  기분이 더 좋아지는
      soothe: '\u{1F319}', // 🌙  마음을 달래주는
      energy: '\u26A1',    // ⚡  힘이 나는
      breeze: '\u2601',    // ☁  아무 생각 없이 듣는
      focus:  '\u{1F9D8}'  // 🧘 집중하기 좋은
    },

    // 4단계: 장르 (genre)
    genre: {
      // 🇰🇷 = U+1F1F0 U+1F1F7
      kpop: '\uD83C\uDDF0\uD83C\uDDF7',
      // 🇯🇵 = U+1F1EF U+1F1F5
      jpop: '\uD83C\uDDEF\uD83C\uDDF5',
      pop:  '\u{1F30D}', // 🌍  POP(글로벌)
      rock: '\u{1F3B8}'  // 🎸  락 / 메탈
    }
  };

  // ────────────────────────── 스텝 전환 ──────────────────────────
  function setStep(n) {
    currentStep = n;

    steps.forEach((el, idx) => {
      el.classList.toggle('hidden', idx !== n - 1);
    });

    dots.forEach((dot) => {
      dot.classList.toggle('active', Number(dot.dataset.stepDot) === n);
    });

    // 뒤로가기 버튼 노출 범위 (1~4단계에서만 보이게)
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      if (n > 1 && n <= 5) backBtn.classList.remove('hidden');
      else backBtn.classList.add('hidden');
    }
  }

  // ────────────────────────── STEP1: 기본 감정 ──────────────────────────
  $('#step1').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;

    const emo = btn.dataset.emotion;
    state.emotion = emo;
    state.mood = EMOTION_TO_MOOD[emo] || 'calm';

    // 기본 감정 이모티콘 트레일에 추가
    addTrailIcon(EMOJI_TRAIL_MAP.emotion[emo]);

    if (state.mood) {
      document.body.setAttribute('data-mood', state.mood);
    }

    // STEP2 버튼 동적 생성
    const list = SUB_EMOTIONS[emo] || [];
    const box = $('#subEmotionContainer');
    box.innerHTML = '';
    list.forEach((item) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.dataset.subEmotion = item.label;
      b.dataset.subKey = item.key;
      b.textContent = item.label;

      const label = item.icon ? `${item.icon} ${item.label}` : item.label;
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

  // ────────────────────────── STEP2: 하위 감정 ──────────────────────────
  $('#step2').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;

    state.subEmotion = btn.dataset.subEmotion || btn.textContent.trim();
    state.subKey = btn.dataset.subKey || null;

    // 세부 감정 이모티콘 트레일에 추가
    if (state.subKey) {
      addTrailIcon(EMOJI_TRAIL_MAP.sub[state.subKey]);
    }

    setStep(3);
  });

  // ────────────────────────── STEP3: 음악 분위기 ──────────────────────────
  $('#step3').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;

    state.tone = btn.dataset.tone;

    // 분위기(tone) 이모티콘 트레일에 추가
    if (state.tone) {
      addTrailIcon(EMOJI_TRAIL_MAP.tone[state.tone]);
    }

    setStep(4);
  });

  // ────────────────────────── STEP4: 장르 / 국가 ──────────────────────────
  $('#step4').addEventListener('click', (e) => {
    const btn = e.target.closest('button.choice');
    if (!btn) return;

    state.genre = btn.dataset.genre;
    state.nation = btn.dataset.nation || 'global';

    // 장르(genre) 이모티콘 트레일에 추가
    if (state.genre) {
      addTrailIcon(EMOJI_TRAIL_MAP.genre[state.genre]);
    }

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

  // ────────────────────────── STEP5: 결과 문구 생성 ──────────────────────────
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

  // ────────────────────────── 플레이어로 이동 ──────────────────────────
  $('#goPlayer').addEventListener('click', (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (state.mood)   params.set('mood',   state.mood);
    if (state.genre)  params.set('genre',  state.genre);
    if (state.nation) params.set('nation', state.nation);
    if (state.tone)   params.set('tone',   state.tone);

    // 세부 감정 코드도 같이 전송
    if (state.subKey) {
      params.set('sub', state.subKey);          // in_love / lonely ...
    } else if (state.subEmotion) {
      params.set('sub', state.subEmotion);      // 코드가 없으면 한글 문구라도
    }

    const qs = params.toString();
    const url = qs ? `./player.html?${qs}` : './player.html';
    location.href = url;
  });

  // ────────────────────────── 처음부터 다시 ──────────────────────────
  $('#restart').addEventListener('click', () => {
    state.emotion = null;
    state.mood = null;
    state.subEmotion = null;
    state.subKey = null;
    state.tone = null;
    state.genre = null;
    state.nation = null;
    state.color = null;

    document.body.setAttribute('data-mood', 'calm');
    clearTrail();

    setStep(1);
  });

  // ────────────────────────── 뒤로 가기 버튼 ──────────────────────────
  const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (currentStep <= 1) return;

    // ★ 방금 선택했던 스텝의 아이콘 하나 되감기
    if (trailBox && trailBox.lastChild) {
      trailBox.removeChild(trailBox.lastChild);
    }

    const prevStep = currentStep - 1;
    setStep(prevStep);
  });
}

  // 초기 상태
  setStep(1);
})();
