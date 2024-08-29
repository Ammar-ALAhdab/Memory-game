// Main Varaibles
let duration = 1000;
let endGameTime = 120;
let enterName = document.getElementById("name");
let cardContainer = document.querySelector(".container");
let spanName = document.querySelector("header .game-info .name span");
let time = document.querySelector("header .game-info .timer span");
let flagIfWin = null;
let wrongSpan = document.querySelector("header .game-info .wrong-tries span");
wrongSpan.innerHTML = 0;
// Shufffling Array Of Photos
let cards = Array.from(cardContainer.children);
let shuffleArray = cards.sort(() => Math.random() - 0.5);
for (i in shuffleArray) {
  cardContainer.appendChild(shuffleArray[i]);
}
//  ***************
// Another Way To Random Array
// cards.sort(() => (Math.random() > 0.5)? 1: -1 );
//  ***************

// Start button
// The First Button
let countDown = null;
document.getElementById("start").addEventListener("click", function () {
  document.getElementById("click").play();
  if (enterName.value == "" || enterName.value == null) {
    spanName.innerHTML = "غير معروف";
  } else {
    spanName.innerHTML = enterName.value;
  }
  document.querySelector(".splash-screen").remove();
  countDown = setInterval(timeOfEnd, 1000);
});

// The Second Button
document.getElementById("start2").addEventListener("click", function () {
  document.getElementById("click").play();
  document.querySelector(".splash-screen").remove();
  countDown = setInterval(timeOfEnd, 1000);
});

// Result Button
document.querySelector("#results").addEventListener("click", () => {
  document.getElementById("click").play();
  document.querySelector(".splash-screen").remove();
  result = document.querySelector(".results");
  result.style.cssText = " display:flex;";
  showResult();
});

// Show Table Of Results Function
function showResult() {
  // Sorting Results Depand On Time
  let players = new Map();
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(`name${i}`) != "" && localStorage.getItem(`name${i}`) != null ) 
      players.set(localStorage.getItem(`name${i}`), [
        localStorage.getItem(`time${i}`),
        localStorage.getItem(`wrong${i}`),
      ]);
  }
  let sortingResults = [];
  if (players.size > 0) {
    sortingResults = Array.from(players.entries()).sort(
      ([, [a]], [, [b]]) => b - a
    ).filter(([a,[]]) => a != null);
  }
  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 2; j++) {
      if (sortingResults[i] != null) {
        if (
          document
            .querySelectorAll("table tbody tr")
            [i].children[j].classList.contains("wrong-player")
        ) {
          document.querySelectorAll("table tbody tr")[i].children[j].innerHTML =
            sortingResults[i][1][1];
        } else if (
          document
            .querySelectorAll("table tbody tr")
            [i].children[j].classList.contains("time-player")
            ) {  let min = Math.floor(sortingResults[i][1][0] / 60), sec = sortingResults[i][1][0] % 60;
          document.querySelectorAll("table tbody tr")[i].children[j].innerHTML =`${min < 10 ? `0${min}` : `${min}`}:${
            sec < 10 ? `0${sec}` : `${sec}`
          }`;
        } else {
          document.querySelectorAll("table tbody tr")[i].children[j].innerHTML =
            sortingResults[i][0];
        }
      }
    }
  }
}

// Calculting Time Of End Game Function
function timeOfEnd() {
  let min = Math.floor(endGameTime / 60);
  let sec = endGameTime % 60;
  time.innerHTML = `${min < 10 ? `0${min}` : `${min}`}:${
    sec < 10 ? `0${sec}` : `${sec}`
  }`;
  if (endGameTime > 0) {
    endGameTime--;
  } else {
    loseGame();
    clearInterval(countDown);
  }
  if (flagIfWin == true) {
    clearInterval(countDown);
  }
}

// Add Events To Cards
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // Add Flipped Class
    flipTheCard(card);
  });
});

function flipTheCard(selectedCard) {
  selectedCard.classList.add("flipped");
  // Collect All Flipped Cards
  let flippedCards = cards.filter((c) => c.classList.contains("flipped"));
  if (flippedCards.length == 2) {
    // Stop Click When Open Two Cards
    preventClicking();
    // Match Same Cards
    matchCards(flippedCards[0], flippedCards[1]);
  }
}

function preventClicking() {
  cardContainer.classList.add("stop-clicking");
  setTimeout(function () {
    cardContainer.classList.remove("stop-clicking");
  }, duration);
}

function matchCards(cardOne, cardTwo) {
  if (cardOne.dataset.img === cardTwo.dataset.img) {
    cardOne.classList.remove("flipped");
    cardTwo.classList.remove("flipped");
    cardOne.classList.add("match");
    cardTwo.classList.add("match");
    document.getElementById("success").play();
  } else {
    wrongSpan.innerHTML = parseInt(wrongSpan.innerHTML) + 1;
    setTimeout(function () {
      cardOne.classList.remove("flipped");
      cardTwo.classList.remove("flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

// Lose & Win Game Function
let playAgainButton = document.createElement("button"),
  exiteButton = document.createElement("button");

// Lose Game Function
function loseGame() {
  flagIfWin = false;
  spalshScreen();
}

// Win Game Function
let checkIfWin = setInterval(winGame, 500);
function winGame() {
  let matchedCards = cards.filter((c) => c.classList.contains("match"));
  if (matchedCards.length == document.querySelectorAll(".card").length) {
    flagIfWin = true;
    setTimeout(spalshScreen, 2000);
    recordResults();
    clearInterval(checkIfWin);
  }
}

function recordResults() {
  let number = parseInt(localStorage.getItem("number")) || 0;
  // Record Player Name
  localStorage.setItem(`name${number}`, `${spanName.innerHTML}`);
  // Record Player Time
  localStorage.setItem(`time${number}`, `${endGameTime}`);
  // Record Player Wrongs
  localStorage.setItem(`wrong${number}`, `${wrongSpan.innerHTML}`);
  number++;
  // Record Player Number
  localStorage.setItem(`number`, `${number}`);
}

// Spalsh Screen Generator
function spalshScreen() {
  let spalsh = document.createElement("div"),
    spalshContent = document.createElement("div"),
    text = document.createElement("p");
  spalsh.classList.add("splash-screen");
  spalshContent.classList.add("splash-content");
  text.innerHTML = flagIfWin
    ? "!مبــــــروك لقد فزت"
    : "للأسف نفذ الوقت، حظاً موفقاً في المرة القادمة";
  playAgainButton.innerHTML = "لعب مرة أخرى";
  exiteButton.innerHTML = "خروج";
  spalshContent.append(text);
  spalshContent.append(exiteButton);
  spalshContent.append(playAgainButton);
  spalsh.append(spalshContent);
  document.body.appendChild(spalsh);
  flagIfWin
    ? document.getElementById("win").play()
    : document.getElementById("lose").play();
}

// Add Events To Play Agin & Exit Buttons
playAgainButton.addEventListener("click", () => {
  window.location.reload();
});

exiteButton.addEventListener("click", () => {
  window.close();
});
