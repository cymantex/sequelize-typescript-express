import chalk from "chalk";
import {routes} from "./constants/routes";
import {constants} from "./constants/";

const titleBorderLength = 60;

function sectionTitle(title: string): void {
    console.log(chalk.bold("-".repeat(titleBorderLength)));
    console.log(chalk.bold(title));
    console.log(chalk.bold("-".repeat(titleBorderLength)));
}

function endOfSection(): void {
    console.log(chalk.bold("-".repeat(titleBorderLength) + "\n"));
}

function apiPoints(): void {
    let routesLog = "";
    let urlCount = 0;

    Object.keys(routes)
        .forEach((addressKey, i) => {
            urlCount++;
            const url = routes[addressKey];
            routesLog += `${urlCount}: ${url}/`;

            if(i !== Object.keys(routes).length - 1){
                routesLog += "\n";
            }
        });

    console.log(chalk.bold("Available API points:"));
    console.log(routesLog);
}

function message(message: string, ...optionalParams: string[]): void {
    if(optionalParams.length > 0){
        console.log(message, optionalParams);
    } else {
        console.log(message);
    }
}

function title(title: string): void {
    console.log(chalk.bold(title));
}

function error(error: string): void {
    console.log(chalk.red(error));
}

function success(success: string): void {
    console.log(chalk.green(success));
}

export const log = (constants.isTest) ? {
    sectionTitle: () => {},
    endOfSection: () => {},
    apiPoints: () => {},
    error: () => {},
    success: () => {},
    title: () => {},
    message: () => {}
} : {
    sectionTitle,
    endOfSection,
    apiPoints,
    error,
    success,
    title,
    message
};