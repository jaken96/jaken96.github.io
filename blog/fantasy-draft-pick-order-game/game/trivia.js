"use strict";

const topic = document.body.dataset.topic;
const source = document.body.dataset.source;
const questionText = document.querySelector("#question-text");
const answerText = document.querySelector("#answer-text");
const answerPanel = document.querySelector("#answer-panel");
const difficulty = document.querySelector("#difficulty");
const questionCount = document.querySelector("#question-count");
const showAnswerButton = document.querySelector("#show-answer");
const nextQuestionButton = document.querySelector("#next-question");
const errorMessage = document.querySelector("#error-message");

let questions = [];
let currentQuestion = null;
let seenQuestionIds = readSeenQuestions();

function readSeenQuestions() {
  try {
    return JSON.parse(sessionStorage.getItem(`seen-${topic}`)) || [];
  } catch {
    return [];
  }
}

function saveSeenQuestions() {
  sessionStorage.setItem(`seen-${topic}`, JSON.stringify(seenQuestionIds));
}

function randomIndex(maximum) {
  if (maximum <= 1) return 0;

  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);
  return randomValue[0] % maximum;
}

function pickRandomQuestion() {
  let available = questions.filter(
    (question) => !seenQuestionIds.includes(question.id),
  );

  if (available.length === 0) {
    seenQuestionIds = [];
    available = questions;
  }

  currentQuestion = available[randomIndex(available.length)];
  seenQuestionIds.push(currentQuestion.id);
  saveSeenQuestions();
  renderQuestion();
}

function renderQuestion() {
  questionText.textContent = currentQuestion.question;
  answerText.textContent = currentQuestion.answer;
  difficulty.textContent = currentQuestion.difficulty;
  questionCount.textContent = String(seenQuestionIds.length);
  answerPanel.hidden = true;
  showAnswerButton.textContent = "Show Answer";
  showAnswerButton.disabled = false;
  nextQuestionButton.disabled = false;
}

function revealAnswer() {
  if (!currentQuestion) return;
  answerPanel.hidden = false;
  showAnswerButton.textContent = "Answer Shown";
  showAnswerButton.disabled = true;
}

async function loadQuestions() {
  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Question data returned status ${response.status}.`);
    }

    questions = await response.json();
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("The question bank is empty.");
    }

    pickRandomQuestion();
  } catch (error) {
    questionText.textContent = "The question bank could not be loaded.";
    errorMessage.textContent =
      "Serve these files from a web server so the page can read its JSON data.";
    errorMessage.hidden = false;
    showAnswerButton.disabled = true;
    nextQuestionButton.disabled = true;
    console.error(error);
  }
}

showAnswerButton.addEventListener("click", revealAnswer);
nextQuestionButton.addEventListener("click", pickRandomQuestion);

loadQuestions();
