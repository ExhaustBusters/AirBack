'use strict'

var config = require('./config');
const Web3 = require('web3');
const Solidity = require('solc');
const fs = require('fs');
const ruuvi = require('node-ruuvitag');

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(config.etherHost));
var gasPrice = 1000000000;
web3.eth.getGasPrice(function (error, result) {
	    gasPrice = result;
});

const source = fs.readFileSync('./contracts/airback.sol', "utf8");
const compiled = Solidity.compile(source, 1).contracts[':AirBack'];
const contract_interface = compiled.interface;
const contract_bytecode = compiled.bytecode;

var pressure = async function(){
await ruuvi.on('found', tag => {
	  console.log('Found RuuviTag, id: ' + tag.id);
	  tag.on('updated', data => {
		      console.log('Got data from RuuviTag ' + tag.id + ':\n' +
			            JSON.stringify(data, null, '\t'));
		    });
});

}

var pollution = async function() {
	    await web3.eth.personal.unlockAccount(config.etherAccount, config.etherPassword);
	    var contract = new web3.eth.Contract(JSON.parse(contract_interface), config.etherContract);
	    var result = await contract.methods.get_pollution().call(function(e, result){
		        console.log(result);
	    });
	    console.log(result)
	    await web3.eth.personal.lockAccount(config.etherAccount);
};
pressure();
pollution();
