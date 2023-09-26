// Global variables defined here
let gameStarted = false; // Flag to track if the game has started or not
const airplane = document.querySelector('#airplane'); // Reference to the airplane element
const airplaneSpeed = 50; // Speed at which the airplane moves
let bombSpeed; // Speed at which bombs fall
let score = 0; // Player's score based on seconds survived
let bombs = []; // Array to store bomb elements

// Function to start the game
function startGame() {
  if (gameStarted) return; // If the game is already started, do nothing
  gameStarted = true; // Set the game as started
  document.addEventListener('keydown', (e) => { //Event listener for keydown event (Airplane movement logic)
    if (e.key === 'ArrowLeft' && gameStarted) {
      moveAirplane('left'); // Move the airplane to the left
    } else if (e.key === 'ArrowRight' && gameStarted) {
      moveAirplane('right'); // Move the airplane to the right
    }
  });

  airplane.style.left = '750px'; // Initialize the airplane's position
  bombSpeed = 5; // Set the initial bomb falling speed
  score = 0; // Initialize the score
  document.querySelector('#bomb-container').innerHTML = ''; // Clear the bomb container
  bombs = []; // Clear the bomb array
  let second = 1000;
  scoreInterval = setInterval(() => {
    ++score; // Increment the score every second
  }, second);
  gameInterval = setInterval(() => {
    createBomb();
  }, second / 2);
}

// Function to move the airplane within the page
function moveAirplane(direction) {
  const initialPos = 750;
  const leftLimit = 160;
  const rightLimit = 1349;
  const airplanePositionX = parseInt(airplane.style.left) || initialPos; // Get current X position of the airplane
  if (direction === 'left' && airplanePositionX >= leftLimit) { // Check and move left within the page limits
    airplane.style.left = airplanePositionX - airplaneSpeed + 'px'; // Update the airplane's left position
  } else if (direction === 'right' && airplanePositionX <= rightLimit) { // Check and move right within the page limits
    airplane.style.left = airplanePositionX + airplaneSpeed + 'px'; // Update the airplane's left position
  }
}

// Function for bomb creation
function createBomb() {
  const bombLimit = 105;
  const bombElement = document.createElement('div'); // Bomb element creation
  bombElement.className = 'bomb'; // Adding to CSS style class
  bombElement.style.left = Math.random() * (window.innerWidth - bombLimit) + 'px'; // X random position
  bombElement.style.top = '15px'; // Y initial position top
  document.querySelector('#bomb-container').appendChild(bombElement); // Adding the bomb to the bomb container
  bombs.push(bombElement); // Adding the bomb to an array of bombs
  animateBomb(bombElement); // Animating the bomb
}

// Function for checking collision of the modified rectangular objects
function isCollision(rect1, rect2) {
  let restriction = 50;
  return (
    rect1.left < rect2.right - restriction && // Here we modify the rectangular shape
    rect1.right > rect2.left + restriction && // Adding and decreasing with 50
    rect1.top < rect2.bottom - restriction && // Immitates the shape of a plane
    rect1.bottom > rect2.top + restriction
  );
}

// Function for verifying collision between plane and bomb
function checkCollision(bomb) {
  const bombRect = bomb.getBoundingClientRect();
  const airplaneRect = airplane.getBoundingClientRect();

  if (isCollision(bombRect, airplaneRect)) {
    endGame(); // Collision detected = endGame.
  }
}



// Function that animates the bomb
function animateBomb(bombElement) {
  const animate = () => {
    const bombPositionY = parseInt(bombElement.style.top);
    if (bombPositionY >= window.innerHeight) {
      bombElement.remove();
      return;
    }

    bombElement.style.top = bombPositionY + bombSpeed + 'px';
    checkCollision(bombElement); // Checks collision 

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

// Function to end the game
function endGame() {
  clearInterval(scoreInterval); // Stop updating the score
  clearInterval(gameInterval); // Stop creating bombs
  gameStarted = false; // Set the game as not started
  const finalMessage = document.getElementById("text"); // Get the element to display the game over message
  finalMessage.innerHTML = `
    <h1 id="text" class="card-body align-items-center d-flex justify-content-center">
      Game Over! Your score was: "${score}"
      <ul></ul>
      <button id="restart-button" type="button" class="btn btn-primary" onClick="window.location.reload()">Restart</button>
    </h1>`;
}
