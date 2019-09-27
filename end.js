const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const finalScore = document.querySelector("#finalScore");

const mostRecentScore = localStorage.getItem('mostRecentScore')
// JSON.parse converts a JSON data in to actual array;
// JSON.stringify converts array to a JSON format
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;
finalScore.textContent = mostRecentScore;
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();
    console.log("clicked");

    const score = {
        score: Math.floor(Math.random() * 100),//mostRecentScore,
        name: username.value,
    };
    // add the score object to highScores 
    highScores.push(score);
    // sort the highScores
    highScores.sort((a, b) => b.score - a.score);
    // remove anything after index 5
    highScores.splice(MAX_HIGH_SCORES);
    // update the localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    window.location.assign('/');
};