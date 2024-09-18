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
    messageElement.textContent = 'Sorry you lost, would you like to play again?';
    stopAllTracks(); // Stop any currently playing tracks
    if (track7) {
        track7.play().catch(error => console.error("Error playing track 7: ", error));
    }
} else {
    // This handles both 'win' and any invalid results
    messageElement.textContent = 'Congratulations, you won!! Would you like to play again?';
    stopAllTracks(); // Stop any currently playing tracks
    if (track4) {
        track4.play().catch(error => console.error("Error playing track 4: ", error));
    }
}

// Function to reload the game
function playAgain() {
    window.location.href = 'MacBeth.html'; // Adjust this path to your actual game file
}

// Function to exit the game
function exitGame() {
    // Window.close() may not work in all browsers due to security reasons.
    if (confirm('Are you sure you want to exit?')) {
        window.close();
    }
}
