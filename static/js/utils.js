// Fisher-Yates shuffle — truly random, unlike sort(() => Math.random() - 0.5)
function shuffle(array) {
  const arr = [...array]; // don't mutate the original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getQuestionsByTopic(topic) {
  return QUESTIONS.filter(q => q.topic === topic);
}

function getQuestionsByTopicAndDifficulty(topic, difficulty) {
  if (difficulty === "all") return QUESTIONS.filter(q => q.topic === topic);
  return QUESTIONS.filter(q => q.topic === topic && q.difficulty === difficulty);
}

function percent(score, total) {
  return Math.round((score / total) * 100);
}
