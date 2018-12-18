import * as fs from "fs";

type Scripts = {[argument: string]: () => Promise<any>};

const main = async (): Promise<any> => {
    const scripts: Scripts = readScripts();
    const argument: string = getValidatedArgument(Object.keys(scripts));

    return scripts[argument]();
};

const readScripts = (): Scripts => {
    const scriptsFolder = `${__dirname}/scripts`;

    return fs.readdirSync(scriptsFolder)
        .map((file: string) => file.replace(".ts", ""))
        .map((file: string) => ({[file]: require(`${scriptsFolder}/${file}`).default}))
        .reduce((scripts: Scripts, script: Scripts) => ({...scripts, ...script}));
};

const getValidatedArgument = (args: string[]): string => {
    const argument = process.argv[2];

    if (process.argv.length < 3 || !args.includes(argument)) {
        printHelp(args);
    }

    return argument;
};

const printHelp = (args: string[]): void => {
    let options = "";

    args.forEach((arg, i) => {
        options += arg;

        if (i !== args.length - 1) {
            options += "|";
        }
    });

    console.log(`Usage: node scripts.js [${options}]`);
    process.exit(0);
};

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });