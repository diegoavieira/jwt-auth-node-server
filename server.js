const http = require('http');
const app = require('./config/express');

http.createServer(app).listen(5200, function() {
  console.log(`Server listening: http://loacalhost:${this.address().port}`);
});
