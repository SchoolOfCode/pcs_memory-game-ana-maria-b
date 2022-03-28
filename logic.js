const gridDiv = document.querySelector(".grid");
const guessesLabel = document.querySelector("#guesses");

// Fetch cards from API
// Fetch request

let numOfGuesses = 0;

async function getShuffledDeck() {
  let res = await fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  );
  const deck = await res.json();
  return deck;
}

const deckData = await getShuffledDeck();
let deckId = deckData.deck_id;

async function getAllCards(deckId) {
  let res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`
  );
  const cards = await res.json();
  return cards;
}

const allCardsData = await getAllCards(deckId);
const cardsArray = allCardsData.cards;

function createCards(cardsArray) {
  cardsArray.forEach((card, index) => {
    console.log({ card, index });
    const ele = document.createElement("img");
    ele.id = card.code;
    ele.classList.add("card");
    ele.dataset.index = index;
    ele.src = "./card-back.png";
    ele.onclick = () => onCardClick(index, ele);
    gridDiv.appendChild(ele);
  });
}

createCards(cardsArray);

let correctGuesses = []; // Store all the correct guesses
let currentGuesses = []; // Stores up to 2 cards

function onCardClick(cardIndex, ele) {
  const clickedCard = cardsArray[cardIndex];
  // Flip the card
  ele.src = clickedCard.image;
  ele.classList.add("card-current-guess");
  // Add to current guesses (temp)
  currentGuesses.push(clickedCard);

  // If the card guesses array has 2 elements - check if there is a match
  if (currentGuesses.length === 2) {
    // Disable click events on the grid
    gridDiv.style.pointerEvents = "none";
    const card1 = currentGuesses[0];
    const card2 = currentGuesses[1];
    const isMatch = card1.value === card2.value && card1.code !== card2.code;
    console.log({ isMatch });
    if (isMatch) handleGuessIsMatch();
    else handleGuessIsNotMatch();
    updateGuessLabel();
  }
}

function updateGuessLabel() {
  numOfGuesses++;
  guessesLabel.innerText = numOfGuesses;
}

function handleGuessIsMatch(ele) {
  // Disable the click
  // Add to list of correct guesses
  currentGuesses.forEach((cardData) => {
    const id = cardData.code;
    const ele = document.getElementById(id);
    ele.classList.add("card-correct");
    gridDiv.style.pointerEvents = "initial";
  });
  currentGuesses = [];
}

function handleGuessIsNotMatch() {
  setTimeout(() => {
    gridDiv.style.pointerEvents = "initial";
    currentGuesses.forEach((cardData) => {
      const id = cardData.code;
      const ele = document.getElementById(id);
      ele.src = "./card-back.png";
      ele.classList.remove("card-current-guess");
    });
    currentGuesses = [];
  }, 1500);
}

function maker(eleType, parent, html, cla) {
  const ele = document.createElement(eleType);
  ele.classList.add(cla);
  ele.innerHTML = html;
  return parent.appendChild(ele);
}
