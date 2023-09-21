// Global variables defined here
let gameStarted = false; // Flag to track if the game has started or not
const airplane = document.querySelector('#airplane'); // Reference to the airplane element
const airplaneSpeed = 50; // Speed at which the airplane moves
let bombSpeed; // Speed at which bombs fall
let score = 0; // Player's score based on seconds survived
let bombs = []; // Array to store bomb elements

// Function to move the airplane within the page
function moveAirplane(direction) {
  if (gameStarted) {
    const airplanePositionX = parseInt(airplane.style.left) || 750; // Get current X position of the airplane
    if (direction === 'left' && airplanePositionX >= 160) { // Check and move left within the page limits
      airplane.style.left = airplanePositionX - airplaneSpeed + 'px'; // Update the airplane's left position
    } else if (direction === 'right' && airplanePositionX <= 1349) { // Check and move right within the page limits
      airplane.style.left = airplanePositionX + airplaneSpeed + 'px'; // Update the airplane's left position
    }
  }
}

// Event listener to move the airplane when arrow keys are pressed
document.addEventListener('keydown', (e) => {
  if (gameStarted) {
    if (e.key === 'ArrowLeft') {
      moveAirplane('left'); // Move the airplane to the left
    } else if (e.key === 'ArrowRight') {
      moveAirplane('right'); // Move the airplane to the right
    }
  }
});

// Function to create a bomb element
function createBomb() {
  const bombElement = document.createElement('div'); // Create a new bomb element
  bombElement.className = 'bomb'; // Add a CSS class to style the bomb
  bombElement.style.left = Math.random() * (window.innerWidth - 105) + 'px'; // Set a random X position within the page
  bombElement.style.top = '15px'; // Set the initial Y position at the top
  document.querySelector('#bomb-container').appendChild(bombElement); // Add the bomb to the bomb container
  bombs.push(bombElement); // Add the bomb to the array of bombs

  // Function to animate the bomb's falling
  function animateBomb() {
    const bombPositionY = parseInt(bombElement.style.top); // Get the current Y position
    if (bombPositionY >= window.innerHeight) { // If bomb reaches the bottom of the page
      bombElement.remove(); // Remove the bomb element
      bombs.shift(); // Remove the bomb from the array
      return;
    }

    bombElement.style.top = bombPositionY + bombSpeed + 'px'; // Update the bomb's Y position
    checkCollision(bombElement); // Check for collisions with the airplane

    requestAnimationFrame(animateBomb); // Request the next animation frame
  }

  requestAnimationFrame(animateBomb); // Start the bomb's animation
}

// Function to check for collisions between the bomb and the airplane
function checkCollision(bomb) {
  const bombRect = bomb.getBoundingClientRect(); // Get bomb's bounding rectangle
  const airplaneRect = airplane.getBoundingClientRect(); // Get airplane's bounding rectangle

  if (
    bombRect.left < airplaneRect.right - 50 &&
    bombRect.right > airplaneRect.left + 50 &&
    bombRect.top < airplaneRect.bottom - 50 &&
    bombRect.bottom > airplaneRect.top + 50
  ) {
    endGame(); // If a collision is detected, end the game
  }
}

// Function to start the game
function startGame() {
  if (gameStarted) return; // If the game is already started, do nothing
  gameStarted = true; // Set the game as started
  airplane.style.left = '750px'; // Initialize the airplane's position
  bombSpeed = 5; // Set the initial bomb falling speed
  score = 0; // Initialize the score
  document.querySelector('#bomb-container').innerHTML = ''; // Clear the bomb container
  bombs = []; // Clear the bomb array
  scoreInterval = setInterval(() => {
    ++score; // Increment the score every second
  }, 1000);

  gameInterval = setInterval(() => {
    createBomb(); // Create a bomb at regular intervals
  }, 400);
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
