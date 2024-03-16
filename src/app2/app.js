const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let secretNumber = Math.floor(Math.random() * 10) + 1;
let attempts = 0;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/gaming', (req, res) => {
  res.send(`
    <h1>Guess the Number Game</h1>
    <p>I'm thinking of a number between 1 and 10. Can you guess it?</p>
    <form action="/guess" method="post">
      <input type="number" name="guess" min="1" max="10" required>
      <button type="submit">Guess</button>
    </form>
  `);
});

app.post('/guess', (req, res) => {
  const userGuess = parseInt(req.body.guess, 10);
  attempts++;
  if (userGuess === secretNumber) {
    res.send(`<p>Congratulations! You guessed the number in ${attempts} attempts. The secret number was ${secretNumber}.</p><a href="/">Play again</a>`);
    secretNumber = Math.floor(Math.random() * 10) + 1;
    attempts = 0;
  } else if (userGuess < secretNumber) {
    res.send('<p>Your guess is too low. Try again.</p><a href="/">Back</a>');
  } else {
    res.send('<p>Your guess is too high. Try again.</p><a href="/">Back</a>');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
