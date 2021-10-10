const chalk = require("chalk");
const {
    Worker
} = require('worker_threads');
const amqp = require('amqplib');

const init = async () => {

    // creating queue to send generated water molecule to printer
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = "water-producer"

    channel.assertQueue(queueName, {
        durable: false
    });


    let ho2ModuleCount = 0;
    let hModuleCount = 0;
    let oModuleCount = 0;

    let hydrogenPipeline = Array(500).fill('H');
    let oxygenPipeline = Array(500).fill('O');

    const producer = new Worker('./producer.js');
    producer.on('message', ({
        h,
        o
    }) => {
        hModuleCount += 2;
        oModuleCount++
        console.log(chalk.red.bold(`Produce H Module : ${hModuleCount} : ${h}`));
        console.log(chalk.red.bold(`Produce O Module : ${oModuleCount} : ${o}`));
        hydrogenPipeline = hydrogenPipeline.concat(h);
        oxygenPipeline = oxygenPipeline.concat(o);
    });

    const consumers = Array(50);

    for (let i = 0; i < consumers.length; i++) {
        consumers[i] = new Worker('./consumer.js');
        consumers[i].on('message', ({
            result
        }) => {
            ho2ModuleCount++

            postToConsumer(consumers[i])

            // sending generated water molecules via queue to print data in batch of 10 after each 1 sec
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(`Consume H2O Module : ${ho2ModuleCount} : ${result}`)));

            producer.postMessage('add h and o');
        });

        postToConsumer(consumers[i])

    }

    function postToConsumer(consumer) {
        consumer.postMessage({
            h1: hydrogenPipeline.pop(),
            h2: hydrogenPipeline.pop(),
            o1: oxygenPipeline.pop()
        });
    }
}

init();
