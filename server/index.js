const http = require('http');
var Logger = require('./config/winston');
const controller = require('./Account/controller');

const port = process.env.PORT || 3000;




Logger.info('*** Requested for First log... ***');

Logger.error(`Test error Log!`);


const server = http.createServer(controller);
server.listen(port, () => {Logger.info(`listening on port ${port}`)});


