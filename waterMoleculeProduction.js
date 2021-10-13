const amqp = require('amqplib');
const chalk = require("chalk");
const {
    Worker
} = require('worker_threads');
require('./output');

const resumeHydrogenAtomProduction = require('./atomsProduction/hydrogenProduction').resumeHydrogenAtomProduction;
const resumeOxygenAtomProduction = require('./atomsProduction/oxygenProduction').resumeOxygenAtomProduction;

let outputQConnection;
let outputQChannel;
const prepareOutputQueue = async () => {
    outputQConnection = await amqp.connect(`amqp://localhost`)

    outputQChannel = await outputQConnection.createChannel()

    outputQChannel.assertQueue('outputQueue', {
        durable: false
    });

}
const init = async () => {
    try {

        let H2O_count = 0
        const connection = await amqp.connect(`amqp://localhost`)

        connection.getMaxListeners(52)
        const channel = await connection.createChannel()
        // channel.setMaxListeners(50)

        channel.assertExchange('provideAtomsToUnit', 'fanout', {
            durable: false
        });

        for (let i = 0; i < 50; i++) {

            channel.assertQueue(`water_produce_${i}`, {
                durable: false
            });
            channel.bindQueue(`water_produce_${i}`, 'provideAtomsToUnit', '');
            channel.consume('', (msg) => {
                const pipelineData = JSON.parse(msg.content.toString('utf8'));
                let hydrogenAtoms = [...pipelineData.data.hydrogen]
                let oxygenAtoms = [...pipelineData.data.oxygen]

                if (hydrogenAtoms.length && oxygenAtoms.length) {
                    const factoryUnit = new Worker('./factoryUnit.js');
                    hydrogenAtoms.pop();
                    hydrogenAtoms.pop()
                    oxygenAtoms.pop()
                    factoryUnit.postMessage({
                        h1: 'H',
                        h2: 'H',
                        o1: "O",
                        i: 0
                    });

                    factoryUnit.on('message', ({
                        result
                    }) => {
                        H2O_count++

                        resumeHydrogenAtomProduction();
                        resumeHydrogenAtomProduction();
                        resumeOxygenAtomProduction();

                        outputQChannel.sendToQueue('outputQueue', Buffer.from(JSON.stringify(`Consume H2O Module : ${H2O_count}`)));

                    })
                }


            }, {
                noAck: true
            });
        }

    } catch (error) {
        console.error('err', error);
        throw error
    }
}

prepareOutputQueue()

init()