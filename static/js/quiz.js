const appRoot = document.getElementById('app-root');

let quizState = {
  topic: null,
  difficulty: null,
  questions: [],
  current: 0,
  answers: [],
  score: 0,
  timer: null,
  timeRemaining: 60,
  isActive: false,
  finished: false
};


function renderTopicSelection() {
  appRoot.innerHTML = `
    <section class="premium-home">

      <div class="hero-banner">
        <div class="hero-left">
          <div class="hello-pill">
            Hello again! 👋
          </div>

          <h1>
            Let's Test Your
            <span>Knowledge!</span>
          </h1>

          <p>
            Choose a topic below and start your quiz journey.<br>
            Challenge yourself and track your progress.
          </p>
        </div>

        <div class="hero-right">
          <div class="hero-emoji">🎓📚💡</div>
        </div>
      </div>

      <section class="topic-area">
        <div class="topic-heading">
          <h2>Choose a Topic</h2>
          <p>Select a topic to start the quiz</p>
        </div>

        <div class="premium-topic-grid">

          <div class="topic-card blue-card">
            <div class="topic-icon">💻</div>
            <h3>HTML</h3>
            <p>Test your knowledge of HTML structure and semantic elements.</p>
            <button onclick="startQuiz('HTML')">Start Quiz →</button>
          </div>

          <div class="topic-card green-card">
            <div class="topic-icon">🧩</div>
            <h3>CSS</h3>
            <p>Challenge yourself with layouts, styling and responsive design.</p>
            <button onclick="startQuiz('CSS')">Start Quiz →</button>
          </div>

          <div class="topic-card orange-card">
            <div class="topic-icon">⚡</div>
            <h3>JavaScript</h3>
            <p>Explore JavaScript logic, DOM manipulation and fundamentals.</p>
            <button onclick="startQuiz('JavaScript')">Start Quiz →</button>
          </div>

        </div>

        <div class="motivation-card">
          🏆 <strong>Keep Learning, Keep Growing!</strong><br>
          Every quiz you take brings you one step closer to mastery.
        </div>
      </section>

    </section>
  `;
}

// Step 1: user picks topic → show difficulty picker
function startQuiz(topic) {
  quizState.topic = topic;
  renderDifficultyPicker(topic);
}

// Step 2: user picks difficulty → begin quiz
function beginQuiz(difficulty) {
  const questions = shuffle(getQuestionsByTopicAndDifficulty(quizState.topic, difficulty));

  if (quizState.timer) quizState.timer.stop();

  quizState = {
    topic: quizState.topic,
    difficulty,
    questions,
    current: 0,
    answers: Array(questions.length).fill(null),
    score: 0,
    timer: null,
    timeRemaining: 0,
    isActive: true,
    finished: false
  };

  startGlobalTimer();
  renderQuiz();
}

function renderDifficultyPicker(topic) {
  const topicEmojis = { HTML: "💻", CSS: "🧩", JavaScript: "⚡" };
  appRoot.innerHTML = `
    <section class="premium-home">
      <div class="hero-banner">
        <div class="hero-left">
          <div class="hello-pill">${topicEmojis[topic] || "📚"} ${topic} Quiz</div>
          <h1>Choose Your <span>Difficulty</span></h1>
          <p>Pick a level that matches your confidence. You can always try a harder one after!</p>
        </div>
        <div class="hero-right"><div class="hero-emoji">🎯</div></div>
      </div>

      <section class="topic-area">
        <div class="topic-heading">
          <h2>Select Difficulty</h2>
          <p>Each level draws from a different question set</p>
        </div>

        <div class="premium-topic-grid">
          <div class="topic-card blue-card">
            <div class="topic-icon">🟢</div>
            <h3>Easy</h3>
            <p>Core fundamentals — great for beginners or a quick warm-up.</p>
            <button onclick="beginQuiz('easy')">Start Easy →</button>
          </div>
          <div class="topic-card green-card">
            <div class="topic-icon">🟡</div>
            <h3>Medium</h3>
            <p>Practical knowledge you'd use day-to-day as a developer.</p>
            <button onclick="beginQuiz('medium')">Start Medium →</button>
          </div>
          <div class="topic-card orange-card">
            <div class="topic-icon">🔴</div>
            <h3>Hard</h3>
            <p>Tricky edge cases and deeper concepts to really test you.</p>
            <button onclick="beginQuiz('hard')">Start Hard →</button>
          </div>
        </div>

        <div class="motivation-card">
          <a href="#" onclick="renderTopicSelection(); return false;" style="color:inherit;">← Back to Topics</a>
        </div>
      </section>
    </section>
  `;
}

// FIX: One timer for the whole quiz — counts down from questions.length * 15 seconds
// Each question gets ~15s. Adjust the multiplier as you like.
function startGlobalTimer() {
  const totalTime = quizState.questions.length * 15; // e.g. 9 questions = 135s
  quizState.timeRemaining = totalTime;

  if (quizState.timer) quizState.timer.stop();
  quizState.timer = new Timer(totalTime, updateTimer, handleTimeout);
  quizState.timer.start();
}

function updateTimer(time) {
  quizState.timeRemaining = time;
  const totalTime = quizState.questions.length * 15;
  const bar = document.getElementById('timer-bar');
  if (bar) {
    bar.style.width = `${(time / totalTime) * 100}%`;
    bar.className = 'progress-bar ' + (time <= 15 ? 'warning' : 'normal');
    bar.style.background = time <= 15 ? '#ef4444' : '#22c55e';
  }
  const label = document.getElementById('timer-label');
  if (label) label.textContent = `${time}s`;
}

function handleTimeout() {
  // Time's up for the whole quiz — auto-finish
  quizState.isActive = false;
  quizState.finished = true;
  renderResults();
}


function handleAnswer(optionIdx) {
  if (!quizState.isActive || quizState.finished) return;

  // Don't allow changing an already-answered question
  if (quizState.answers[quizState.current] !== null) return;

  quizState.answers[quizState.current] = optionIdx;

  // FIX: Removed redundant if/else — both branches did the same thing.
  // Recalculate score cleanly from all answers.
  quizState.score = quizState.answers.reduce((acc, ans, idx) =>
    ans === quizState.questions[idx].correctAnswer ? acc + 1 : acc, 0);

  renderQuiz(); // Re-render to highlight the selected answer
}


function finishQuiz() {
  if (quizState.timer) quizState.timer.stop();
  quizState.isActive = false;
  quizState.finished = true;
  renderResults();
}


function renderQuiz() {
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  const progress = quizState.current + 1;
  const totalTime = total * 15;
  const timerPercent = (quizState.timeRemaining / totalTime) * 100;
  const timerBarColor = quizState.timeRemaining <= 15 ? '#ef4444' : '#22c55e';
  const answered = quizState.answers[quizState.current];

  appRoot.innerHTML = `
    <div class="quiz-premium-wrapper">

      <div class="quiz-header-card">
        <div class="quiz-header-left">
          <div class="quiz-badge">${quizState.topic} · ${quizState.difficulty.charAt(0).toUpperCase() + quizState.difficulty.slice(1)}</div>
          <h2>Challenge Yourself 🚀</h2>
          <p>Progress: ${progress} of ${total}</p>
        </div>

        <div class="quiz-header-right">
          <div class="timer-box">
            <div class="timer-label" id="timer-label">
              ⏳ ${quizState.timeRemaining}s remaining
            </div>
            <div class="progress">
              <div id="timer-bar"
                class="progress-bar"
                style="
                  width:${timerPercent}%;
                  background:${timerBarColor};
                  transition:width 1s linear;
                ">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-layout">

        <div class="question-main-card">

          <div class="question-progress-row">
            <span>Question ${progress} of ${total}</span>

            <div class="progress-dots">
              ${quizState.questions.map((_, i) => `
                <span
                  class="progress-dot ${i === quizState.current ? 'active-dot' : ''}">
                </span>
              `).join('')}
            </div>
          </div>

          <h3 class="question-title">
            ${q.question}
          </h3>

          <div class="answers-container">
            ${q.options.map((opt, i) => {
              const isSelected = answered === i;
              const isCorrect = i === q.correctAnswer;
              // Show correct/wrong feedback once answered
              let extraClass = '';
              if (answered !== null) {
                if (isCorrect) extraClass = 'correct-answer';
                else if (isSelected) extraClass = 'wrong-answer';
              } else if (isSelected) {
                extraClass = 'selected-answer';
              }

              return `
                <button
                  class="answer-card ${extraClass}"
                  onclick="handleAnswer(${i})"
                  ${answered !== null ? 'disabled' : ''}>

                  <span class="answer-letter">
                    ${String.fromCharCode(65 + i)}
                  </span>

                  <span class="answer-text">
                    ${opt}
                  </span>

                </button>
              `;
            }).join('')}
          </div>

          <div class="quiz-nav-buttons">
            <button
              class="btn btn-secondary"
              ${quizState.current === 0 ? 'disabled' : ''}
              onclick="goToQuestion(${quizState.current - 1})">
              ← Previous
            </button>

            <button
              class="btn btn-primary"
              ${quizState.current === quizState.questions.length - 1 ? 'disabled' : ''}
              onclick="goToQuestion(${quizState.current + 1})">
              Next →
            </button>
          </div>
        </div>

        <div class="sidebar-card">

          <h4>Question Navigator</h4>

          <div class="navigator-grid">
            ${quizState.questions.map((_, i) => {
              const isAnswered = quizState.answers[i] !== null;
              return `
                <button
                  class="nav-question-btn ${i === quizState.current ? 'nav-active' : ''} ${isAnswered ? 'nav-answered' : ''}"
                  onclick="goToQuestion(${i})">
                  ${i + 1}
                </button>
              `;
            }).join('')}
          </div>

          <button
            class="finish-btn"
            onclick="finishQuiz()">
            Finish Quiz
          </button>

          <a
            href="#"
            onclick="renderTopicSelection(); if(quizState.timer)quizState.timer.stop(); return false;"
            class="back-link">
            ← Back to Topics
          </a>

        </div>

      </div>
    </div>
  `;
}

// FIX: goToQuestion no longer restarts the timer
function goToQuestion(idx) {
  if (idx < 0 || idx >= quizState.questions.length) return;
  quizState.current = idx;
  renderQuiz(); // Just re-render, don't touch the timer
}


async function saveScore(score, totalQuestions) {
  if (quizState.scoreSaved) return; // Don't double-save
  quizState.scoreSaved = true;
  try {
    await fetch("/submit-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        score: score,
        total_questions: totalQuestions,
        topic: quizState.topic,
        difficulty: quizState.difficulty
      })
    });
  } catch (error) {
    console.error("Error saving score:", error);
  }
}


async function renderResults() {
  const total = quizState.questions.length;

  await saveScore(quizState.score, total);
  const scorePct = percent(quizState.score, total);
  let color = "text-primary";
  if (scorePct >= 80) color = "text-success";
  else if (scorePct < 50) color = "text-danger";

  appRoot.innerHTML = `
    <div class="text-center mb-4">
      <h2>Quiz Results</h2>
      <div class="display-4 fw-bold ${color}">${scorePct}%</div>
      <div class="mb-2">Score: ${quizState.score} / ${total}</div>
      <button class="btn btn-secondary mt-2" onclick="renderTopicSelection()">Try Another Topic</button>
      <a href="/history" class="btn btn-primary mt-2 ms-2">View Previous Results</a>
    </div>
    <div class="card">
      <div class="card-body">
        <h5>Review</h5>
        <ol class="list-group list-group-numbered">
          ${quizState.questions.map((q, i) => {
    const userAns = quizState.answers[i];
    const correct = userAns === q.correctAnswer;
    let ansClass = "";
    if (userAns === null) ansClass = "list-group-item-warning";
    else if (correct) ansClass = "list-group-item-success";
    else ansClass = "list-group-item-danger";
    return `
              <li class="list-group-item ${ansClass}">
                <div><strong>Q${i + 1}:</strong> ${q.question}</div>
                <div>
                  Your answer:
                  ${userAns === null ? '<em>Not answered</em>' : q.options[userAns]}
                  ${userAns === q.correctAnswer
                    ? '<span class="badge bg-success ms-2">Correct</span>'
                    : userAns !== null
                    ? '<span class="badge bg-danger ms-2">Incorrect</span>'
                    : '<span class="badge bg-warning text-dark ms-2">Skipped</span>'}
                </div>
                <div>Correct answer: <strong>${q.options[q.correctAnswer]}</strong></div>
              </li>
            `;
  }).join('')}
        </ol>
      </div>
    </div>
  `;
}

// Initial render
renderTopicSelection();

// Expose functions for inline onclick handlers
window.handleAnswer = handleAnswer;
window.goToQuestion = goToQuestion;
window.finishQuiz = finishQuiz;
window.renderTopicSelection = renderTopicSelection;
window.startQuiz = startQuiz;
window.beginQuiz = beginQuiz;
window.renderDifficultyPicker = renderDifficultyPicker;
