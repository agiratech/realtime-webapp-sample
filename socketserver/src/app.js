const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const comments = {};

io.on("connection", socket => {
  let previousId;
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("getComment", commentId => {
    safeJoin(commentId);
    socket.emit("comment", comments[commentId]);
  });

  socket.on("addComment", comment => {
    comments[comment.id] = comment;
    safeJoin(comment.id);
    io.emit("comments", comments);
    socket.emit("comment", comment);
  });

  socket.on("editComment", comment => {
    comments[comment.id] = comment;
    socket.to(comment.id).emit("comment", comment);
  });
  
  socket.on("typingComment", flag => {
    io.emit("typing", flag);
  });
  
  io.emit("comments", comments);
});

http.listen(4444);