var config = require('./config');
const Web3 = require('web3');
const Solidity = require('solc');
const fs = require('fs');
const ruuvi = require('node-ruuvitag');
var Gpio = require('onoff').Gpio
var sleep = require('sleep');

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

var ledRed = new Gpio(3, 'out')
var ledGreen = new Gpio(2, 'out')

var iv_r
var iv_g

var blinkR = function () {
	sleep.sleep(1);
	ledRed.writeSync(1);
	sleep.sleep(1)
	ledRed.writeSync(0);
}

var blinkG = function () {
	sleep.sleep(1);
	ledGreen.writeSync(1);
	sleep.sleep(1);
	ledGreen.writeSync(0);
}


var addpollution = async function(amount) {
	    await web3.eth.personal.unlockAccount(config.etherAccount, config.etherPassword);
	    var contract = new web3.eth.Contract(JSON.parse(contract_interface), config.etherContract);
	    var result = await contract.methods.add_pollution(amount).send({from:config.etherAccount},function(e, result){
		        console.log(result);
	    });
	    await web3.eth.personal.lockAccount(config.etherAccount);
};

ruuvi.on('found', tag => {
	  console.log('Found RuuviTag, id: ' + tag.id);
	  tag.on('updated', data => {
		  accelerationY = parseInt(Number(data['accelerationY']));
		  if(accelerationY>100){
		  	console.log(accelerationY);
			try{
				addpollution(accelerationY);
				if(accelerationY>320)
					blinkR();
				else
					blinkG();
			}catch(e){
			}
		  }
	  });
});
