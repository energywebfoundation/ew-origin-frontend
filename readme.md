# Deprecation notice

This package is deprecated and is no longer maintained.

**For the latest version or Origin please visit [energywebfoundation/origin](https://github.com/energywebfoundation/origin).**

# ewf-coo-ui

## install

in order to install ewf-coo-ui you simply have to run
<code> npm install </code>. If, by any chance, you're getting an error while installing web3, simply run the <code>npm install</code> command again. 

## start
the ui needs a running ethereum-client and a web3-object

### web3-object
in order to use the ewf-coo you need a web3-provider. Both Metamask and the parity chrome extenstion should be working and be configured to run on localhost:8545. Keep in mind that currently metamasks runs more stable. 

### ethereum-client
the ui is both working with ganache and parity, but needs the address of the CoO.sol contract. 

#### Tobalaba
The current version of the coo-contract for event-horizon is on 0x3f02292B92158CA38fF77E6eE945747daD36921a on tobalaba. Keep in mind that they're using real assets and data. 

#### ganache / parity for testing or simulating
For testing contract functions and simulation data (e.g. energy producing or consuming) we suggest ganache-cli. Open the ewf-coo repository, run <code>npm install</code> there.
The right preconfigured ganache can be started with the <code>npm run start-ganache</code> command. Afterwards the contracts have to be deployed using the <code>npm run migrate</code> command. The addresses of all contracts will be in the console-output so you simply have to copy the address of the coo-contract. 

In order to simuate creation of assets, energy and demands run the <code>npm run startSim</code> command on the ewf-coo repo. 

### starting and accessing the ui
the ui requires a webserver that can be started with the command <code>npm start</code> on the ui-repository. 

Afterwards the webpage can be accessed with localhost:3000/COO-CONTRACT_ADDRESS/assets/production where COO-CONTRACT_ADDRESS is the address of the coo-contract (either 0x3f02292B92158CA38fF77E6eE945747daD36921a for tobalaba or the output from your migration file. 


