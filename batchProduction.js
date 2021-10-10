const amqp = require('amqplib');
const chalk = require("chalk");

const init = async () => {
    try {
        let waterMoleculeStorage = []
        const connection = await amqp.connect(`amqp://localhost`)

        const channel = await connection.createChannel()

        const queueName = "water-producer"
        let message = "this is Bharat";

        channel.assertQueue(queueName, {
            durable: false
        });

        channel.prefetch(10) // fetch 10 molecules at a time


        channel.consume(queueName, (msg) => {
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
    } catch (error) {
        console.error('err', error);
        throw error
    }
}

init()