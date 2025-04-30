// script.js

const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("playerName");
const difficultyScreen = document.getElementById("difficulty-screen");
const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const finalScore = document.getElementById("final-score");
const timeDisplay = document.getElementById("time");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let playerName = "";
let difficulty = "";

const allQuestions = {
  easy: [
    { question: "2 + 2 = ?", answers: [
        { text: "4", correct: true },
        { text: "3", correct: false },
        { text: "5", correct: false },
        { text: "2", correct: false } ] },
    { question: "5 - 1 = ?", answers: [
        { text: "3", correct: false },
        { text: "4", correct: true },
        { text: "5", correct: false },
        { text: "6", correct: false } ] },
    { question: "10 / 2 = ?", answers: [
        { text: "5", correct: true },
        { text: "2", correct: false },
        { text: "10", correct: false },
        { text: "20", correct: false } ] },
    { question: "6 + 2 = ?", answers: [
        { text: "7", correct: false },
        { text: "8", correct: true },
        { text: "9", correct: false },
        { text: "6", correct: false } ] },
    { question: "9 - 3 = ?", answers: [
        { text: "6", correct: true },
        { text: "5", correct: false },
        { text: "7", correct: false },
        { text: "4", correct: false } ] },
    // Add 15 more
  ],
  hard: [
    { question: "12 x 12 = ?", answers: [
        { text: "144", correct: true },
        { text: "121", correct: false },
        { text: "122", correct: false },
        { text: "148", correct: false } ] },
    { question: "100 / 4 = ?", answers: [
        { text: "25", correct: true },
        { text: "20", correct: false },
        { text: "30", correct: false },
        { text: "40", correct: false } ] },
    { question: "15 x 3 = ?", answers: [
        { text: "45", correct: true },
        { text: "40", correct: false },
        { text: "35", correct: false },
        { text: "30", correct: false } ] },
    { question: "144 / 12 = ?", answers: [
        { text: "12", correct: true },
        { text: "10", correct: false },
        { text: "11", correct: false },
        { text: "13", correct: false } ] },
    { question: "9 x 9 = ?", answers: [
        { text: "81", correct: true },
        { text: "72", correct: false },
        { text: "90", correct: false },
        { text: "99", correct: false } ] },
    // Add 15 more
  ]
};

startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name");
    return;
  }
  startScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

function setDifficulty(level) {
  difficulty = level;
  questions = getRandomQuestions(allQuestions[difficulty], 5);
  difficultyScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  startQuiz();
}

function getRandomQuestions(questionSet, num) {
  const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  nextButton.classList.add("hidden");
  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();
  const question = questions[currentQuestionIndex];
  questionElement.innerText = `${currentQuestionIndex + 1}. ${question.question}`;
  question.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.classList.add("btn");
    if (ans.correct) btn.dataset.correct = "true";
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hidden");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";
  if (correct) score++;
  setStatusClass(selectedBtn, correct);
  Array.from(answerButtons.children).forEach((btn) => {
    btn.disabled = true;
    setStatusClass(btn, btn.dataset.correct === "true");
  });
  nextButton.classList.remove("hidden");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  element.classList.add(correct ? "correct" : "wrong");
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

function startTimer() {
  timeLeft = 30;
  timeDisplay.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  quizContainer.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScore.innerText = `${playerName}, your score: ${score}/${questions.length}`;

  saveToLeaderboard(playerName, score);
}

function saveToLeaderboard(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  const top5 = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(top5));
}