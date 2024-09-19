
// Questions and answers
const questions = [
    {
        question: "What is the name of Macbeth's wife?",
        options: ["Lady Montague","Lady Macbeth", "Lady Capulet", "Lady Macbeth", "Lady Macbethra"],
        correct: 2
    },
    {
        question: "Which prophecy is told to Macbeth by the witches?",
        options: [
            "He will become King of Scotland",
            "He will defeat Macduff",
            "Banquo’s children will inherit the throne",
            "None of the above"
        ],
        correct: 0
    },
    {
        question: "What is Macbeth’s tragic flaw?",
        options: ["Greed", "Ambition", "Jealousy", "Anger"],
        correct: 1
    },
    {
        question: "Who kills Macbeth at the end of the play?",
        options: ["Banquo", "Malcolm", "Macduff", "Duncan"],
        correct: 2
    },
    {
        question: "What does Lady Macbeth obsessively try to do in her sleep?",
        options: ["Clean blood from her hands", "Read a letter", "Find her crown", "Escape the castle"],
        correct: 0
    },
    {
        question: "Where is Macbeth's castle located?",
        options: ["Fife", "Inverness", "Dunsinane", "Scone"],
        correct: 1
    },
    {
        question: "Who is the first character to see the ghost of Banquo?",
        options: ["Macbeth", "Lady Macbeth", "Banquo's son", "The witches"],
        correct: 0
    },
    {
        question: "Which forest is mentioned in the witches' prophecy?",
        options: ["Sherwood", "Dunsinane", "Birnam", "Falkirk"],
        correct: 2
    },
    {
        question: "Who becomes king after Macbeth's death?",
        options: ["Duncan", "Macduff", "Banquo", "Malcolm"],
        correct: 3
    }
];


// Function to exit the game
function exitGame() {
    alert("Thanks for playing! The game will now end.");
    // Add any logic for exiting (e.g., closing the window, stopping the game)
    window.close();  // This may not work in all browsers but can be used
}

// Game state
let currentQuestion = 0;
let score = 0;
let moneyTree = ['Pick The Next Player', 'Extra 10 minutes break', 'Free Snack', 'NO HOMEWORK'];
let lifelines = {phoneAFriend: true, askTheClass: true, fiftyFifty: true};
let askTheClassTimer = null;
let timeLeft = 30; // Time limit in seconds

// Define audio tracks
const audioTracks = {
    track1: new Audio('audio/track1.mp3'),
    track2: new Audio('audio/track2.mp3'),
    track3: new Audio('audio/track3.mp3'),
    track4: new Audio('audio/track4.mp3'),
    track6: new Audio('audio/track6.mp3'), // Plays before track 2
    track7: new Audio('audio/track7.mp3')  // Plays when player loses
};

// Variables to track if specific tracks are playing
let track1Playing = false;
let track2Playing = false;

// Function to loop tracks
function loopTrack(track) {
    track.loop = true;
    track.play().catch(error => console.error("Track playback failed: ", error));
}

// Function to play track once
function playTrackOnce(track) {
    track.play().catch(error => console.error("Track playback failed: ", error));
}

// Load the question and options
function loadQuestion() {
    // Reset all options visibility for the new question
    for (let i = 1; i <= 4; i++) {
        document.getElementById("option" + i).style.visibility = "visible";
        document.getElementById("option" + i).style.backgroundColor = ""; // Reset background color
    }

    // Hide the timer when moving to the next question
    document.getElementById("timer").textContent = '';

    document.getElementById("question").textContent = questions[currentQuestion].question;
    document.getElementById("option1").textContent = questions[currentQuestion].options[0];
    document.getElementById("option2").textContent = questions[currentQuestion].options[1];
    document.getElementById("option3").textContent = questions[currentQuestion].options[2];
    document.getElementById("option4").textContent = questions[currentQuestion].options[3];

    // Play the appropriate background music
    playBackgroundMusic();

    // Update money tree highlighting
    updateMoneyTreeHighlighting();
}

// Update money tree highlighting based on the current question
function updateMoneyTreeHighlighting() {
    let moneyTreeItems = document.querySelectorAll('#money-tree-list li');

    // Remove all existing highlights
    moneyTreeItems.forEach((li) => li.classList.remove('highlighted'));

    // Apply highlighting based on the current question
    if (currentQuestion >= 0 && currentQuestion < 4) {
        moneyTreeItems[3].classList.add('highlighted');
    } else if (currentQuestion >= 4 && currentQuestion < 7) {
        moneyTreeItems[2].classList.add('highlighted');
    } else if (currentQuestion >= 7 && currentQuestion < 9) {
        moneyTreeItems[1].classList.add('highlighted');
    } else if (currentQuestion === 9) {
        moneyTreeItems[0].classList.add('highlighted');
    }
}

// Play background music based on the current question
function playBackgroundMusic() {
    // Stop track1 if the user is on or after question 5
    if (currentQuestion >= 5 && track1Playing) {
        audioTracks.track1.pause();
        audioTracks.track1.currentTime = 0;
        track1Playing = false;
    }

    // Play background music based on the current question
    if (currentQuestion < 5) {
        // Play track1 continuously for questions before the 5th question
        if (!track1Playing) {
            loopTrack(audioTracks.track1); // Play track1 continuously
            track1Playing = true;
        }
    } else if (currentQuestion === 5) {
        // Play track6 once, then play track2 continuously
        if (!track2Playing) {
            playTrackOnce(audioTracks.track6);
            audioTracks.track6.onended = () => {
                loopTrack(audioTracks.track2);
                track2Playing = true;
            };
        }
    } else if (currentQuestion >= 6) {
        // Ensure track2 is playing for questions after the 5th
        if (!track2Playing) {
            loopTrack(audioTracks.track2);
            track2Playing = true;
        }
    }
}

// Stop all audio tracks
function stopAllTracks() {
    Object.values(audioTracks).forEach(track => {
        track.pause();
        track.currentTime = 0;
    });

    track1Playing = false;
    track2Playing = false;
}

// Check the answer
function checkAnswer(option) {
    if (askTheClassTimer) {
        clearInterval(askTheClassTimer);
        askTheClassTimer = null;
        stopAllTracks();
    }

    const selectedOptionElement = document.getElementById("option" + (option + 1));

    // Introduce a 0.5s delay before showing correct/incorrect
    setTimeout(() => {
        if (option === questions[currentQuestion].correct) {
            selectedOptionElement.style.backgroundColor = "green";
            score++;
            currentQuestion++;
            if (currentQuestion < questions.length) {
                setTimeout(loadQuestion, 1000); // Move to the next question after 1 second
            } else {
                stopAllTracks();
                audioTracks.track4.play(); // Play winning track fully
                gameOver(true); // Redirect to result.html with a win result
            }
        } else {
            selectedOptionElement.style.backgroundColor = "red"; // Incorrect answer turns red
            setTimeout(() => {
                stopAllTracks();
                audioTracks.track7.play();
                gameOver(false); // Redirect to result.html with a loss result
            }, 1000); // Delay the loss message by 1 second
        }
    }, 500); // 0.5 second delay
}

// Lifeline: 50/50
function fiftyFifty() {
    if (lifelines.fiftyFifty) {
        let correctAnswer = questions[currentQuestion].correct;
        let optionsToDisable = [];

        // Find two incorrect options to disable (hide)
        for (let i = 0; i < 4; i++) {
            if (i !== correctAnswer && optionsToDisable.length < 2) {
                optionsToDisable.push(i);
            }
        }

        // Hide the two incorrect options for the current question
        optionsToDisable.forEach(optionIndex => {
            document.getElementById("option" + (optionIndex + 1)).style.visibility = "hidden";
        });

        lifelines.fiftyFifty = false;
        document.getElementById("fifty").disabled = true;
    } else {
        alert("You already used 50/50!");
    }
}

// Lifeline: Phone a Friend
function phoneAFriend() {
    if (lifelines.phoneAFriend) {
        let correctAnswerText = questions[currentQuestion].options[questions[currentQuestion].correct];
        alert("You called a friend! They suggest: '" + correctAnswerText + "'.");
        lifelines.phoneAFriend = false;
        document.getElementById("phone").disabled = true;
    } else {
        alert("You already used Phone a Friend!");
    }
}

// Lifeline: Ask the Class
function askTheClass() {
    if (lifelines.askTheClass) {
        lifelines.askTheClass = false;
        document.getElementById("ask").disabled = true;

        stopAllTracks(); // Stop any playing background music
        audioTracks.track3.play().catch(error => console.error("Error playing track 3: ", error)); // Play timer track

        alert("You have 30 seconds to ask the class, you then must answer or lose. Press ok to start the timer");

        // Display the countdown timer
        document.getElementById("timer").textContent = `${timeLeft} seconds`;
        askTheClassTimer = setInterval(function () {
            timeLeft--;
            document.getElementById("timer").textContent = `${timeLeft} seconds`;

            if (timeLeft <= 0) {
                clearInterval(askTheClassTimer);
                askTheClassTimer = null;
                audioTracks.track3.pause(); // Stop timer track
                gameOver(false); // Redirect to result.html with a loss result
            }
        }, 1000); // 1000ms = 1 second
    } else {
        alert("You already used Ask the Class!");
    }
}

// Function to handle redirection to the results page
function gameOver(isWin) {
    const result = isWin ? 'win' : 'lose';
    window.location.href = `result.html?result=${result}`;
}

// Reset the game
function resetGame() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    lifelines = {phoneAFriend: true, askTheClass: true, fiftyFifty: true};

    // Re-enable all options and lifelines
    for (let i = 1; i <= 4; i++) {
        document.getElementById("option" + i).disabled = false;
        document.getElementById("option" + i).style.visibility = "visible"; // Reset visibility
        document.getElementById("option" + i).style.backgroundColor = ""; // Reset background color
    }
    document.getElementById("phone").disabled = false;
    document.getElementById("ask").disabled = false;
    document.getElementById("fifty").disabled = false;

    resetMoneyTreeHighlighting(); // Ensure money tree resets
    loadQuestion(); // Load the first question
}

// Reset money tree highlighting
function resetMoneyTreeHighlighting() {
    let moneyTreeItems = document.querySelectorAll('#money-tree-list li');
    moneyTreeItems.forEach((li) => li.classList.remove('highlighted')); // Remove all highlights
}
