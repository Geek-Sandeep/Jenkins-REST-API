const express = require('express');
const deploy = require('./handlers/deploy');
const callbackLogs = require('./handlers/cb-logs');
const getLogs = require('./handlers/get-logs');

const app = express();

app.use(express.json());
app.use(express.text());

app.get('/', (req, res) => {
  res.json('up!');
});

app.post('/jenkins/deploy', deploy);

app.get('/cb-logs', callbackLogs);

app.get('/jenkins/logs', getLogs);

app.listen(9090, () => {
  console.log("server is up > 9090");
})

