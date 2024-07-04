const firstWords = ['Cool', 'Fast', 'Smart', 'Clever', 'Happy', 'Lucky', 'Sunny', 'Gentle', 'Brave', 'Crazy'];
const secondWords = ['Dragon', 'Tiger', 'Bear', 'Wolf', 'Eagle', 'Lion', 'Shark', 'Snake', 'Fox', 'Hawk'];
const thirdWords = ['Master', 'Warrior', 'Ninja', 'Wizard', 'Joker', 'Hero', 'Champion', 'Legend', 'Hunter', 'Samurai'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsername() {
  const firstIndex = getRandomInt(0, firstWords.length - 1);
  const secondIndex = getRandomInt(0, secondWords.length - 1);
  const thirdIndex = getRandomInt(0, thirdWords.length - 1);

  const username = `${firstWords[firstIndex]}${secondWords[secondIndex]}${thirdWords[thirdIndex]}`;
  return username;
}

const randomUsername = generateUsername();