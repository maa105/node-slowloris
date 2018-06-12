var _default = {
  headerTimeout: 2000,
  minRate: 500,
  rateOverhead: 500
};
module.exports = function(server, options) {
  var headerTimeout = options.headerTimeout === undefined ? _default.headerTimeout : options.headerTimeout;
  var minRate = options.minRate === undefined ? _default.minRate : options.minRate;

  if(!headerTimeout && !minRate) {
    return;
  }

  var rateOverhead = options.rateOverhead === undefined ? _default.rateOverhead : options.rateOverhead;

  server.on('connection', function(socket) {
    var socketData = {
      start: Date.now(),
      received: 0,
      headerTimeoutTimer: headerTimeout ? setTimeout(function() {
        socket.write('HTTP/1.1 504 Gateway Timeout\r\n\r\n');
        socket.end();
      }, headerTimeout) : 0
    };
    socket.on('close', function(chunk) {
      if(headerTimeout) {
        clearTimeout(socketData.headerTimeoutTimer);
      }
    });
    socket.on('data', function(chunk) {
      if(headerTimeout) {
        clearTimeout(socketData.headerTimeoutTimer);
      }
      if(minRate) {
        socketData.received += chunk.length;
        var delTime = now - socketData.start - rateOverhead;
        if(delTime > 0) {
          var rate = socketData.received / delTime;
          if(rate < minRate) {
            socket.write('HTTP/1.1 504 Gateway Timeout\r\n\r\n');
            socket.end();
          }
        }
      }
    });
  });
};