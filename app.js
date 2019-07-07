const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('short', {stream: accessLogStream}));

app.use(express.static('./public'));
// app.use(express.static('./public_ya'));

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

app.use('/china-trains/train-pay.html', (req, res) => {
  console.log('收到请求');
  let query = req.query.query;
  res.redirect(`/china-trains/train-pay.html?query=${query}`);
})

app.get('/ipaylinks', (req, res) => {
  console.log(req.query);
  console.log('method----get');
  res.send({'state': true})
})
app.post('/ipaylinks', (req, res) => {
  console.log(req.query);
  console.log(req.body);
  console.log('method----post');
  res.send({'state': true})
})

const PORT = 8801;
app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
})
