# node-slowloris
helps aliviate slow loris attack by giving developer 2 extra options, 1- headerTimeout, the timeout to receive the headers. 2- minRate the minimum rate (bytes/second) with rateOverhead to compensate for initial delay to receive data
```  var http = require('http');
  var slowloris = require('slowloris');
  var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
  });
  server.listen(8080);
  slowloris(server, {
    headerTimeout: 5000, // in ms, default 2000
    minRate: 1000,       // bytes per second, default 500
    rateOverhead: 100    // in ms this will be subtracted from the time when calculating the rate, default 500
  });
  ```
  
