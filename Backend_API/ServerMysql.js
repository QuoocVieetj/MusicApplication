var express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');



var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
 
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const artistsRouter = require('./routes/artists');
app.use('/artists', artistsRouter);

const albumsRouter = require('./routes/albums');
app.use('/albums', albumsRouter);

const songsRouter = require('./routes/songs');
app.use('/songs', songsRouter);




// var server = app.listen(5555, function ()
// {
//   var host = server.address().address
//   var port = server.address().port

//   console.log("Example app listening at http://%s:%s", host, port)
// })
const PORT = 5555;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});



