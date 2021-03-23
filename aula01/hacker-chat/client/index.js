import Events from 'events';
import TerminalConroller from "./src/terminalControlle.js";


const componentEmitter = new Events();
const controller = new TerminalConroller();


await controller.initializeTable(componentEmitter);