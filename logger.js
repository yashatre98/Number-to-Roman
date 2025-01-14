/* this file is used to create a logger object that will be used to log messages to the console and to a file.
The logger object is created using the Winston library, which provides a flexible and extensible logging framework for Node.js applications.
The logger object is configured to log messages with a timestamp and log level (info, warn, error) to the console and to a file named app.log.
The logger object is exported so that it can be used in other modules to log messages.
*/

const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`; 
        })
    ),
    transports: [
        new transports.Console({ 
            format: format.combine(
                
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
                format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            )
        }),
        new transports.File({ filename: 'logs/app.log' }) 
    ]
});

module.exports = logger;