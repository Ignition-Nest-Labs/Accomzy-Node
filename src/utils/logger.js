const { format, createLogger, transports } = require("winston");
const chalk = require("chalk");
const moment = require('moment');
const { combine, label, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const CATEGORY = "Accomzy";

const customFormat = printf(({ level, message, label, timestamp }) => {
    let coloredLevel;
    const formattedTimestamp = moment(timestamp).format('DD MMM YYYY h:mm A');

    switch (level) {
        case "info":
            coloredLevel = chalk.blue(level);
            break;
        case "warn":
            coloredLevel = chalk.yellow(level);
            break;
        case "error":
            coloredLevel = chalk.red(level);
            break;
        default:
            coloredLevel = level;
    }
    const logMessage = `${chalk.cyan(formattedTimestamp)} [${chalk.green(label)}] ${coloredLevel}: ${message}`;
    const separator = "-----------------------------------------------------------"; // Adjust the separator as needed

    return `${separator}\n${logMessage}\n${separator}`;

});

const logger = createLogger({
    level: "debug",
    format: combine(
        label({ label: CATEGORY }),
        format.timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(), // Log to console as before
        new DailyRotateFile({
            dirname: 'logs', // Directory to store the logs
            filename: '%DATE%/log.txt', // File name pattern - logs will be stored in daily folders
            datePattern: 'YYYY-MM-DD', // Folder name pattern based on the date
            zippedArchive: true, // Optional: Archive logs after a certain period
            maxFiles: '14d' // Optional: Retain logs for a certain number of days
        })
    ],
});

module.exports = { logger };
