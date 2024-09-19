// Get the result from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const result = urlParams.get('result');

// Get references to the audio elements
const track4 = document.getElementById('track4');
const track7 = document.getElementById('track7');

// Stop all tracks before starting a new one
function stopAllTracks() {
    if (track4) {
        track4.pause();
        track4.currentTime = 0;
    }
    if (track7) {
        track7.pause();
        track7.currentTime = 0;
    }
}

// Display the appropriate message based on the result

const messageElement = document.getElementById('message');

if (result === 'lose') {
    messageElement.textContent = 'Sorry, you lost. Would you like to play again?';
    stopAllTracks(); // Stop any currently playing tracks
    if (track7) {
        track7.play().catch(error => console.error("Error playing track 7: ", error));
    }
} else if (result === 'win') {
    messageElement.textContent = 'Congratulations, you won! Would you like to play again?';
    stopAllTracks(); // Stop any currently playing tracks
    if (track4) {
        track4.play().catch(error => console.error("Error playing track 4: ", error));
    }
} else {
    // For any other results or if no result parameter is found
    messageElement.textContent = 'Would you like to play?';
}

// Function to reload the game
function playAgain() {
    window.location.href = 'index.html';
}

// Function to exit the game
function exitGame() {
    alert("Thanks for playing! The game will now end.");
    // For browsers that prevent window.close, suggest user to close the tab
    if (window.opener) {
        window.close();
    } else {
        alert("Please close this tab/window to exit.");
    }
}

// Add event listeners for buttons
document.getElementById('playAgainButton').addEventListener('click', playAgain);
document.getElementById('exitButton').addEventListener('click', exitGame);

