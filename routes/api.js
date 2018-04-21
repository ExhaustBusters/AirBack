var express = require('express');
var router = express.Router();
var config = require('../config');
const Web3 = require('web3');
const Solidity = require('solc');
const fs = require('fs');

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(config.etherHost));
var gasPrice = 1000000000;
web3.eth.getGasPrice(function (error, result) {
    console.log(error);
    gasPrice = result;
});
const source = fs.readFileSync('./contracts/airback.sol', "utf8");
const compiled = Solidity.compile(source, 1).contracts[':AirBack'];
const contract_interface = compiled.interface;
const contract_bytecode = compiled.bytecode;

/* GET users listing. */
router.get('/data', function(req, res, next) {
  res.send({sensorid:'superid'});
});

var pollution = async function(res) {
    await web3.eth.personal.unlockAccount(config.etherAccount, config.etherPassword);
    var contract = new web3.eth.Contract(JSON.parse(contract_interface), config.etherContract);
    var result = await contract.methods.get_pollution().call(function(e, result){
    console.log(result);
    res.send({contract:config.etherContract, pollution:result});
});
    console.log(result)
    await web3.eth.personal.lockAccount(config.etherAccount);
    res.send({contract:config.etherContract, pollution:result});
};

router.get('/pollution', function(req, res, next) {
  pollution(res);
});

var addpollution = async function(res) {
    await web3.eth.personal.unlockAccount(config.etherAccount, config.etherPassword);
    var contract = new web3.eth.Contract(JSON.parse(contract_interface), config.etherContract);
    console.log(contract.methods.add_pollution);
    var result = await contract.methods.add_pollution(7).send({from:config.etherAccount},function(e, result){
    console.log(result);
    res.send({contract:config.etherContract, transaction:result});
});
    console.log(result)
    await web3.eth.personal.lockAccount(config.etherAccount);
};

router.get('/addpollution', function(req, res, next) {
  addpollution(res);
});

module.exports = router;
