const { parentPort } = require('worker_threads');

parentPort.on('message', () => {
  parentPort.postMessage({h: ['H','H'],o:['O']});
});