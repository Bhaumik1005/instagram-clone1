const winston = require("winston");

module.exports.logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    // File transport
    new winston.transports.File({
      level: "error",
      filename: "./logs/error.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (error) => `[${error.timestamp}] [${error.level}] ${error.message}`
        )
      ),
    }),
    ,
    new winston.transports.File({
      level: "info",
      filename: "./logs/info.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        winston.format.align(),
        winston.format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
  ],
});
