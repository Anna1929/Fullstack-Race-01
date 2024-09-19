// app.js
const express = require('express');
const app = express();
const gameRoutes = require('./routes/gameRoutes');
const waitingRoomRoutes = require('./routes/waitingRoomRoutes');

app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'html');
app.use(express.json());
app.use('/game', gameRoutes);
app.use('/waiting-room', waitingRoomRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
