const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector('#progressText');
const progressBarFull = document.querySelector('#progress-bar-full');
const scoreText = document.querySelector('#score');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// fetching the questions from a JSON file using the FetchAPI
// fetch("questions.json")
//     .then(response => {
//         return response.json();
//     })
//     .then(loadedQuestions => {
//         console.log(loadedQuestions);
//         questions = loadedQuestions;
//         startGame();
//     })
//     .catch(error => {
//         alert('Unable to load questions, try again');
//         window.location.assign('/');
//     });

// fetching the questions from a Open Trivia DB
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
    .then(response => {
        return response.json();
    })
    .then(loadedQuestions => {
        // console.log(loadedQuestions.results);
        // converting the questions into a new form
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];

            // placing the right answer into a random positions
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

            // deciding which choice is the right answer and insert it into answerChoices array
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;

        });
        startGame();
    })
    .catch(error => {
        alert('Unable to load questions, try again');
        window.location.assign('/');
    });

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    // remove loader and display the question
    game.classList.remove('hidden');
    loader.classList.add('hidden');
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
    // console.log((questionCounter / MAX_QUESTIONS) * 100);
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