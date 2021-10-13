const amqp = require('amqplib');
const chalk = require("chalk");

let waterMoleculeStorage = []
async function init() {
    const connection = await amqp.connect(`amqp://localhost`)

    const channel = await connection.createChannel()

    channel.assertQueue('outputQueue', {
        durable: false
    });

    channel.prefetch(10) // fetch 10 molecules at a time

    channel.consume('outputQueue', (msg) => {

        waterMoleculeStorage.push(msg.content.toString())
        setTimeout(() => {
            if (waterMoleculeStorage.length) {
                console.log(chalk.green.bold(msg.content.toString()));
                channel.ack(msg)
            }

        }, 1000);

    }, {
        noAck: false
    });
}

init();