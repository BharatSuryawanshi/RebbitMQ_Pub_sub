const amqp = require('amqplib');

let connection;
let channel;
const queueName = "oxygen-atom-pipeline"

async function init() {
    // creating queue to send on request Oxygen atoms
    connection = await amqp.connect('amqp://localhost')

    channel = await connection.createChannel()
    // channel.setMaxListeners(700)


    channel.assertQueue(queueName, {
        durable: false
    });


    let maxCapacity = 50;

    for (let i = 0; i < maxCapacity; i++) {

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify('O')));

    }


};

const resumeOxygenAtomProduction = (emptySpaceCount) => {

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify('O')));
}


module.exports = {
    init,
    resumeOxygenAtomProduction
}