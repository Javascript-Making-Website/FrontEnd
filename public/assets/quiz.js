// assets/quiz.js
(function(){
  const form = document.getElementById('quizForm');
  if (!form) return;

  function countVotes(fd){
    const v = { happy:0, sad:0, calm:0, angry:0, energetic:0, excited:0 };
    for (const [, mood] of fd.entries()){
      if (v[mood] != null) v[mood]++;
    }
    return v;
  }
  function argmax(obj){
    return Object.entries(obj).sort((a,b)=>b[1]-a[1])[0][0];
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const votes = countVotes(new FormData(form));
    const mood = argmax(votes) || 'calm';
    location.href = `./player.html?mood=${encodeURIComponent(mood)}`;
  });
})();
