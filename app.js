const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('short', {stream: accessLogStream}));

app.use(express.static('./public'));

const PORT = 8801;
app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
})
