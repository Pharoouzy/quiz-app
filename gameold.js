const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector('#progressText');
const progressBarFull = document.querySelector('#progress-bar-full');
const scoreText = document.querySelector('#score');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: "Inside which HTML tag do we put the JavaScript?",
        choice1: "<javascript>",
        choice2: "<script>",
        choice3: "<js>",
        choice4: "<scripting>",
        answer: 2
    },
    {
        question: "What is the full meaning of 'JSON'?",
        choice1: "JavaScript Objects Notation",
        choice2: "JavaScript Object Notations",
        choice3: "JavaScript Object Notation",
        choice4: "JavaScript Objects Notational",
        answer: 3
    },
    {
        question: "What is the correct syntax for referring to external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World')",
        choice2: "alertBox('Hello World')",
        choice3: "msg('Hello World')",
        choice4: "alert('Hello World')",
        answer: 4
    },
    {
        question: "Can CSS be used in tandem with HTML and Java?", 
        choice1: "True", 
        choice2: "False", 
        choice3: "Neither", 
        choice4: "Both", 
        answer: 1
    }
];

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    
    getNewQuestion();
};

getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        // save user's score to LocalStorage
        localStorage.setItem('mostRecentScore', score);
        // goto the end page
        return window.location.assign("/end.html");

    }

    questionCounter++;
    progressText.textContent = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update the progressbar
    console.log((questionCounter / MAX_QUESTIONS) * 100);
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    // get random number between 1 and 5
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.textContent = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.textContent = currentQuestion['choice' + number];
    });

    // not to repeat this particular question when user is done with it
    availableQuestions.slice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        // console.log(e.target);
        // if not accepting answers
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply = (selectedAnswer == currentQuestion.answer) ? 'correct' : 'incorrect';
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.textContent = score;
};

startGame();