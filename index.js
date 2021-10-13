const amqp = require('amqplib');
require('./waterMoleculeProduction')
const startHydrogenProduction = require('./atomsProduction/hydrogenProduction').init;
const startOxygenProduction = require('./atomsProduction/oxygenProduction').init;
const chalk = require("chalk");

const exchange = 'provideAtomsToUnit'

let connectionForExchange;
let channelForExchange;
async function init() {

    connectionForExchange = await amqp.connect('amqp://localhost')

    channelForExchange = await connectionForExchange.createChannel()

    channelForExchange.assertExchange(exchange, 'fanout', {
        durable: false
    });

}

const joinHydrogenPipeline = async () => {
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = "hydrogen-atom-pipeline"

    channel.assertQueue(queueName, {
        durable: false
    });

    channel.consume(queueName, (msg) => {

        broadcast(JSON.parse(msg.content.toString('utf8')), null)
        channel.ack(msg)
    
    })
}

const joinOxygenPipeline = async () => {
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = "oxygen-atom-pipeline"

    channel.assertQueue(queueName, {
        durable: false
    });

    channel.consume('oxygen-atom-pipeline', (msg) => {

        broadcast(null, JSON.parse(msg.content.toString('utf8')))
        channel.ack(msg)

    })
}

console.log(chalk.red.bold('Water Molecule Production has been Started .... Please wait '));

init()


startHydrogenProduction();
startOxygenProduction()
joinHydrogenPipeline();
joinOxygenPipeline();


let hydrogenBatch = [];
let oxygenBatch = [];

function broadcast(hydrogen, oxygen) {

    if (hydrogen) {
        hydrogenBatch.push(hydrogen);
    }

    if (oxygen) {
        oxygenBatch.push(oxygen);
    }
    if (hydrogenBatch.length == 100 & oxygenBatch.length == 50) {
        channelForExchange.publish(exchange, '', Buffer.from(JSON.stringify({
            data: {
                hydrogen: hydrogenBatch,
                oxygen: oxygenBatch
            }
        })));

        hydrogenBatch = []
        oxygenBatch = []
    }

}