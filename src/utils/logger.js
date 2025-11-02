const {createLogger, format, transports} = require("winston");

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp(),
        format.errors({stack : true}),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(({level, message, timestamp, stack})=>
                `${timestamp} ${level} : ${stack || message}`
                )
            )
        }),
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'})
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' })
    ],
    exitOnError: false,
})


module.exports = logger;
