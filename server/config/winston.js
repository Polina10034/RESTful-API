const fs = require("fs");
const winston = require("winston");
const logDir = "log";

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
module.exports = logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.align(),
                winston.format.simple(),
            ),
            level: 'info'
        }),
        new (require("winston-daily-rotate-file"))({
            // new winston.transports.File({
            filename: `${logDir}/results.log`,
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            )
        }),
        // new winston.transports.File({ 
        //     filename: 'log/error.log', 
        //     level: 'error',
        //     format: winston.format.combine(
        //         winston.format.timestamp(),
        //         winston.format.simple(),
        //     )
        // }),
    ]
});

