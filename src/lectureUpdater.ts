// Updates all lectures in a periodical event

import {exec} from "child_process";
import * as fs from "fs";
import * as mv from "mv";
import { compareFiles } from "./parseLectureSchedule/fileComparison";
import { downloadFile } from "./parseLectureSchedule/fileDownload";

// 30 Minutes
const updateInterval = 1800000;

function updateLectures(course, courseUrl) {
    downloadFile(courseUrl, (filename) => checkIfUpdateNeeded(filename, course));
}

function checkIfUpdateNeeded(filename, course) {
    compareFiles(filename, course, (result) => {
        if (!result) {
            try {
                fs.unlinkSync("tmp/" + filename + ".csv");
            } catch (err) {
                console.error(err);
            }
            try {
                fs.unlinkSync("tmp/" + filename);
            } catch (err) {
                console.error(err);
            }
            mv("tmp/new." + filename, "tmp/" + filename, {mkdirp: true}, (err) => {
                if (err) {
                    throw err;
                }
                updateCsv(filename, course);
            });
        }
    });
}

function updateCsv(filename, course) {
    const tabulaPath = "java/tabula-0.9.2-jar-with-dependencies.jar";
    exec("java -Dfile.encoding=UTF-8 -jar " + tabulaPath + " -g -n -o tmp/" + course + ".csv tmp/" + filename,
        (error, stdout, stderr) => {
            if (!error) {
                console.log("Updated " + course);
            } else {
                console.log("An error occurred while updating " + course);
            }
        });
}

export function updateLecturesPeriodically() {
    const courses = require("../courses.json");
    Object.keys(courses).forEach(((course) => {
        updateLectures(course, courses[course].url);
    }));
    setTimeout(updateLecturesPeriodically, updateInterval);
}