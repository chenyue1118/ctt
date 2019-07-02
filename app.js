const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('short', {stream: accessLogStream}));

app.use(express.static('./public'));

app.get('/paypal', (req, res) => {
  console.log('收到请求--get');
  console.log(req.query);
  res.send({state: 1})
})
app.post('/paypal', (req, res) => {
  console.log('收到请求-post');
  console.log(req.query);
  res.send({state: 1})
})

const PORT = 8801;
app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
})
