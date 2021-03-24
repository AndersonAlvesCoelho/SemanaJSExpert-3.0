/**
  node index.js \
  --username andesonalves \
  --room sala01 \
  --hostUri localhost
 */



import Events from 'events';
import CliConfig from './src/cliConfig.js';
import TerminalConroller from "./src/terminalControlle.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
console.log('config', config);

const componentEmitter = new Events();

// const controller = new TerminalConroller();
// await controller.initializeTable(componentEmitter);