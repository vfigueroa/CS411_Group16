const express = require('express');
const request = require('request');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server started on port 3000'));



