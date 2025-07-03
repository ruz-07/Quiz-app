const categorySelect = document.getElementById('category');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('nextBtn');
const quizSection = document.getElementById('quizSection');
const scoreSection = document.getElementById('scoreSection');

let questions = [];
let currentQuestion = 0;
let score = 0;

function startQuiz() {
  const category = categorySelect.value;
  fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      currentQuestion = 0;
      score = 0;
      document.querySelector('.category-section').style.display = 'none';
      quizSection.style.display = 'block';
      scoreSection.style.display = 'none';
      showQuestion();
    });
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  nextBtn.style.display = 'none';
  answersEl.innerHTML = '';
  const q = questions[currentQuestion];
  questionEl.innerHTML = decodeHTML(q.question);

  const answers = [...q.incorrect_answers];
  const randomIndex = Math.floor(Math.random() * 4);
  answers.splice(randomIndex, 0, q.correct_answer);

  answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = `btn`;
    btn.innerHTML = decodeHTML(answer);
    btn.onclick = () => handleAnswer(btn, answer === q.correct_answer);
    answersEl.appendChild(btn);
  });
}

function handleAnswer(button, isCorrect) {
  const allButtons = answersEl.querySelectorAll('button');
  const q = questions[currentQuestion];
  const correctAnswer = decodeHTML(q.correct_answer);

  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerHTML === correctAnswer) {
      btn.style.background = '#28a745'; // green
      btn.style.color = '#fff';
    }
  });

  if (!isCorrect) {
    button.style.background = '#dc3545'; // red
    button.style.color = '#fff';
  } else {
    score++;
  }

  nextBtn.style.display = 'block';
}

function handleNext() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  quizSection.style.display = 'none';
  scoreSection.innerHTML = `🎉 You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>!<br/><button onclick="startQuiz()">Restart Quiz</button>`;
  scoreSection.style.display = 'block';
  document.querySelector('.category-section').style.display = 'block';

  if (score >= 4) {
    launchConfetti();
  }
}

function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ['#bb0000', '#ffffff', '#00bb00'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
