import { Composer } from "telegraf";
import commandHandler from "./command-handler.js";
import actionsHandler from "./actions-handler.js";
import menuHandler from "./menu-handler.js";
import checkHandler from "./check-handler.js";
import adminHandler from "./admin-handlers.js";

const indexHandler = new Composer();

indexHandler.use(adminHandler);
indexHandler.use(commandHandler);
indexHandler.use(checkHandler);
indexHandler.use(menuHandler);
indexHandler.use(actionsHandler);

export default indexHandler;
