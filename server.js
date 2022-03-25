/* eslint-disable no-undef */
const path = require('path');
const express = require('express');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 5000;
const app = express();

app.use(express.static(DIST_DIR));

app.get('/health', (req, res) => {
  res.send('Ok!');
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'robots.txt'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
