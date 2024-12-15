// Vocabulary questions
const quizQuestions = [
    {
        word: "a",
        options: ["一個", "生氣的", "蘋果", "美麗的"],
        correctAnswer: 0
    },
    {
        word: "able",
        options: ["能夠", "一個", "之上", "年齡"],
        correctAnswer: 0
    },
    {
        word: "about",
        options: ["關於", "能夠", "之後", "害怕"],
        correctAnswer: 0
    },
    {
        word: "above",
        options: ["在...之上", "關於", "接受", "年齡"],
        correctAnswer: 0
    },
    {
        word: "accept",
        options: ["接受", "之上", "害怕", "成就"],
        correctAnswer: 0
    },
    {
        word: "accident",
        options: ["意外", "行動", "帳戶", "成就"],
        correctAnswer: 0
    },
    {
        word: "account",
        options: ["帳戶", "意外", "跨越", "活動"],
        correctAnswer: 0
    },
    {
        word: "achieve",
        options: ["達到", "行動", "活動", "實際的"],
        correctAnswer: 0
    },
    {
        word: "achievement",
        options: ["成就", "行動", "活動", "實際的"],
        correctAnswer: 0
    },
    {
        word: "across",
        options: ["跨越", "行動", "實際的", "添加"],
        correctAnswer: 0
    },
    {
        word: "act",
        options: ["行動", "活動", "實際的", "添加"],
        correctAnswer: 0
    },
    {
        word: "action",
        options: ["行動", "活動", "實際的", "地址"],
        correctAnswer: 0
    },
    {
        word: "active",
        options: ["活躍的", "行動", "實際的", "地址"],
        correctAnswer: 0
    },
    {
        word: "activity",
        options: ["活動", "行動", "實際的", "地址"],
        correctAnswer: 0
    },
    {
        word: "actual",
        options: ["實際的", "活動", "地址", "調整"],
        correctAnswer: 0
    }
];

// DOM elements
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const speakButton = document.getElementById('speak-btn');
const wordElement = document.getElementById('word');
const optionsContainer = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('time');

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;

// Speech synthesis
const speech = window.speechSynthesis;

// Event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', showNextQuestion);
restartButton.addEventListener('click', startQuiz);
speakButton.addEventListener('click', speakWord);

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    startButton.classList.add('hide');
    resultContainer.classList.add('hide');
    currentQuestionIndex = 0;
    score = 0;
    // Shuffle questions at the start
    shuffleArray(quizQuestions);
    showQuestion(quizQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    wordElement.textContent = question.word;
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
    
    nextButton.classList.add('hide');
    startTimer();
}

function startTimer() {
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    
    if (timer) {
        clearInterval(timer);
    }
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    clearInterval(timer);
    const options = optionsContainer.children;
    Array.from(options).forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show correct answer
    options[quizQuestions[currentQuestionIndex].correctAnswer].classList.add('correct');
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        showResults();
    }
}

function selectAnswer(selectedIndex) {
    clearInterval(timer);
    const correct = selectedIndex === quizQuestions[currentQuestionIndex].correctAnswer;
    const options = optionsContainer.children;
    
    // Disable all options after selection
    Array.from(options).forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show correct/wrong feedback
    options[selectedIndex].classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
        options[quizQuestions[currentQuestionIndex].correctAnswer].classList.add('correct');
    } else {
        score++;
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        showResults();
    }
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion(quizQuestions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timer);
    const questionContainer = document.getElementById('quiz-container');
    questionContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    scoreElement.textContent = `${score} / ${quizQuestions.length}`;
}

function speakWord() {
    const utterance = new SpeechSynthesisUtterance(wordElement.textContent);
    utterance.lang = 'en-US';
    speech.speak(utterance);
}
