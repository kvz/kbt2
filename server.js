var http = require('http');
var send = require('send');
var port = process.env.PORT || 4000;

http.createServer(function(req, res) {
  console.log(req.url)
  if (req.url === '/') {
    res.writeHead(301, {'Location': '/index.html'});
    res.end();
    return;
  }

  send(req, req.url)
    .root(__dirname)
    .pipe(res);
}).listen(port);

console.log('Demo running at http://127.0.0.1:' + port + '/');
