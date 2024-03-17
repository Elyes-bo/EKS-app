const express = require('express');
const app = express();
const port = 3000;

function fibonacci(n) {
  if (n <= 1) {
      return n;
  } else {
      return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

app.get('/fibonacci', (req, res) => {
    var a = fibonacci(13)
    res.send(`<h1>${a}</h1>`)
  });

  app.get('/', (req, res) => {
    res.send(`<h1>Hello world !</h1>`)
  });  
  
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Application is healthy'
  });
});

app.get('/readiness', (req, res) => {
  res.json({
    status: 'ready',
    message: 'Application is ready to serve traffic'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
