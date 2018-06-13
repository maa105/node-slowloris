# node-slowloris
helps aliviate slow loris attack by giving developer 2 extra options:

1- headerTimeout, the timeout to receive the headers.

2- minRate the minimum rate (bytes/second) with rateOverhead to compensate for initial delay to receive data

NOTE: As there is no event in node for request start, as in before headers not after headers (since slow header is part of slowloris) I cant measure the time since the request started. SO to circumvent that I used the connection event but had to disable keepAlive since otherwise more than one request wil be served in one connection and I cant measure the time since the requests started (as in before headers as above). It would be great if node adds a request start event this way I could measure the time from that event and wont have to disable the keepAlive functionality

```  var http = require('http');
  var slowloris = require('slowloris');
  var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
  });
  server.listen(8080);
  slowloris(server, {
    headerTimeout: 5000, // in ms, default 2500
    minRate: 1000,       // bytes per second, default 500
    rateOverhead: 100    // in ms this will be subtracted from the time when calculating the rate, default 50
  });
  ```
  
