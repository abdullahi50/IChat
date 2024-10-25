const mongoose = require('mongoose')
const dotenv = require('dotenv')


dotenv.config({path:'./.env'});
const app = require('./app');



mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


const io = require('socket.io')(server)

let socketsConnected = new Set( )
io.on('connection', onConnected)

function onConnected(socket){
  console.log(socket.id)
  socketsConnected.add(socket.id)

  io.emit('clients-total', socketsConnected.size)
 
  socket.on('disconnect',() =>{
    console.log('Sockets disconnected', socket.id)
    socketsConnected.delete(socket.id)
    io.emit('clients-total', socketsConnected.size)
  })
  socket.on('message',(data) =>{
    socket.broadcast.emit('chat-message',data)
    console.log(data)
  })
  socket.on('feedback', (data) =>{
    socket.broadcast.emit('feedback',data)
  })
}