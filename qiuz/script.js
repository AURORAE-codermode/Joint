// Quiz data and logic
const questions = [
  {
    question: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    answer: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1,
  },
  {
    question: 'Which language runs in a web browser?',
    choices: ['Java', 'C', 'Python', 'JavaScript'],
    answer: 3,
  },
  {
    question: 'What does CSS stand for?',
    choices: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
    answer: 0,
  },
  {
    question: 'Which company developed the React library?',
    choices: ['Google', 'Microsoft', 'Facebook', 'Mozilla'],
    answer: 2,
  },
];

// state
let currentQuestionIndex = 0;
let score = 0;

// DOM will be initialized after load
let startScreen, quizScreen, resultScreen, startBtn, restartBtn, questionTitle, choicesDiv, currentSpan, totalSpan, scoreSpan, progressBar, finalScoreSpan, finalTotalSpan, resultMsg;

function initDOM() {
  startScreen = document.getElementById('start-screen');
  quizScreen = document.getElementById('quiz-screen');
  resultScreen = document.getElementById('result-screen');
  startBtn = document.getElementById('start-btn');
  restartBtn = document.getElementById('restart-btn');
  questionTitle = document.getElementById('question-title');
  choicesDiv = document.getElementById('choices');
  currentSpan = document.getElementById('current');
  totalSpan = document.getElementById('total');
  scoreSpan = document.getElementById('score');
  progressBar = document.getElementById('progress');
  finalScoreSpan = document.getElementById('final-score');
  finalTotalSpan = document.getElementById('final-total');
  resultMsg = document.getElementById('result-msg');

  const missing = [];
  ['start-screen','quiz-screen','result-screen','start-btn','restart-btn','question-title','choices','current','total','score','progress','final-score','final-total','result-msg']
    .forEach(id => { if (!document.getElementById(id)) missing.push(id); });
  if (missing.length) {
    console.error('Quiz initialization: missing DOM elements ->', missing.join(', '));
  }

  if (totalSpan) totalSpan.textContent = questions.length;
  if (finalTotalSpan) finalTotalSpan.textContent = questions.length;

  if (startBtn) startBtn.addEventListener('click', startQuiz);
  if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
  if (startBtn) startBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter') startQuiz(); });
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = score;
  startScreen && startScreen.classList.remove('active');
  resultScreen && resultScreen.classList.remove('active');
  quizScreen && quizScreen.classList.add('active');
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  if (questionTitle) questionTitle.textContent = q.question;
  if (currentSpan) currentSpan.textContent = currentQuestionIndex + 1;
  // clear
  if (choicesDiv) choicesDiv.innerHTML = '';

  q.choices.forEach((choiceText, i) => {
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.textContent = choiceText;
    btn.tabIndex = 0;
    btn.addEventListener('click', () => selectChoice(i, btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') selectChoice(i, btn);
    });
    choicesDiv.appendChild(btn);
  });

  updateProgress();
}

function selectChoice(choiceIndex, el) {
  // prevent double click
  if (!el || el.classList.contains('disabled')) return;
  // mark disabled
  Array.from(choicesDiv.children).forEach(c => c.classList.add('disabled'));

  const q = questions[currentQuestionIndex];
  const correct = q.answer === choiceIndex;
  if (correct) {
    el.classList.add('correct');
    score += 1;
    scoreSpan.textContent = score;
  } else {
    el.classList.add('wrong');
    // show correct one
    const correctEl = choicesDiv.children[q.answer];
    if (correctEl) correctEl.classList.add('correct');
  }

  // short delay then next question or show results
  setTimeout(() => {
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= questions.length) {
      showResults();
    } else {
      showQuestion();
    }
  }, 700);
}

function updateProgress() {
  const pct = (currentQuestionIndex / questions.length) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}

function showResults() {
  quizScreen && quizScreen.classList.remove('active');
  resultScreen && resultScreen.classList.add('active');
  if (finalScoreSpan) finalScoreSpan.textContent = score;

  const pct = Math.round((score / questions.length) * 100);
  if (pct >= 80) {
    resultMsg.textContent = "Excellent work! You're a star!";
  } else if (pct >= 50) {
    resultMsg.textContent = "Nice job! A little more practice and you'll ace it.";
  } else {
    resultMsg.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  // go back to start
  resultScreen && resultScreen.classList.remove('active');
  startScreen && startScreen.classList.add('active');
}

// events
// initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDOM);
} else {
  initDOM();
}

// expose for debugging
window._quiz = { questions };