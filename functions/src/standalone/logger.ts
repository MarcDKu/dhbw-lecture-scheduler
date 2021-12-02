import {LoggingWinston} from "@google-cloud/logging-winston";
import * as w from "winston";

const combine = w.format.combine;
const simple = w.format.simple;
const colorize = w.format.colorize;
const timestamp = w.format.timestamp;

const loggingWinston = new LoggingWinston();

export const logger = w.createLogger({
    exitOnError: false,
    format: combine(
        timestamp(),
        colorize(),
        simple(),
    ),
    level: "verbose",
    transports: [
        new w.transports.Console(),
    ],
});
