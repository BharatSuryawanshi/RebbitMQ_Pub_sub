
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ h1,h2,o1 }) => {
  setTimeout(() => {
    parentPort.postMessage({result: h1+h2+o1});
  }, 5000); // ARTIFICIAL CPU INTENSIVE
  
});