const express = require('express');
const path = require('path');
const cors = require('cors');
const FRONTEND_URL = 'http://localhost:3000'

const corsOptions = {
  origin: FRONTEND_URL,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type',
  methods: 'GET, PUT, POST, DELETE',
};
const app = express();
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'build')));
console.log(__dirname);
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 3000);
