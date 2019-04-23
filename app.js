const express = require('express');

const app = express();

app.use(express.static('./public'));

const PORT = 8801;
app.listen(PORT, () => {
  console.log(`Server at ${PORT}`);
})
