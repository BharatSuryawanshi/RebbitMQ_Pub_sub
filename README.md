# somish_lab

Problem statement


Water manufacturing factory


Write a program that simulates a Water manufacturing factory. Your factory has infinitely capable Hydrogen and Oxygen producer units. Provided free of charge by the government. 



Your pipeline should consume 2 atoms of Hydrogen and one atom of Oxygen to generate one molecule of Water (H2O). There are 3 things to note


No wastage of Hydrogen and Oxygen is allowed

The size of the pipes that take the output of both the Hydrogen Oxygen producers is limited in length and can hold only 500 atoms at a time.

The pipeline consumer that combines Hydrogen and Oxygen will take 5 seconds to generate 1 molecule of Water.


Write a program to simulate the producer and consumer. Your factory output should be 10 molecules of water per second.


## Installation
1) Install NodeJS
2) RabbitMQ

## Workers
1) Worker_1 (producer.js):</br>
    This worker push Hydrogen and Oxygen molecules to main block to generate water molecule.
2) Worker_2 (consumer.js):</br>
    This worker combines Hydrogen and Oxygen atoms, and take 5 seconds to generate 1 molecule of Water

## Queue
    As soon as consumer generated the water molecule, generated molecule get pushed into queue named `water-producer`.
    and in batcchProduction.js the consumer of that queue stores the generated water molecules and prints the water molecules in the batch of 10 after every 1 sec

