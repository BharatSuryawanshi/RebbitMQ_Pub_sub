const amqp = require('amqplib');

let connection;
let channel;
const queueName = "hydrogen-atom-pipeline"

async function init() {
    // creating queue to send on request hydrogen atoms
    connection = await amqp.connect('amqp://localhost')

    channel = await connection.createChannel()
    channel.setMaxListeners(700)

    channel.assertQueue(queueName, {
        durable: false
    });


    let maxCapacity = 500;

    for (let i = 0; i < maxCapacity; i++) {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify('H')));
    }



};


const resumeHydrogenAtomProduction = (emptySpaceCount) => {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify('H')));
};

module.exports = {
    init,
    resumeHydrogenAtomProduction
}