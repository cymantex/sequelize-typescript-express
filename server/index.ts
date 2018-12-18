import {startApp} from "./setup/startApp";
import settings from "./settings.json";

startApp(settings).catch(err => {
    console.error(err);
    process.exit(1);
});