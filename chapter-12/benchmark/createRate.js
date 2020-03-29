'use strict';

module.exports.info = 'Creating rates.';


let bc, contx;

module.exports.init = function(blockchain, context, args) {
    bc = blockchain;
    contx = context;

    return Promise.resolve();
};

module.exports.run = function() {

    let args = {
        chaincodeFunction: 'createRate',
        chaincodeArguments: ["1","dealType", "dealPrice"]
    };

    return bc.invokeSmartContract(contx, 'rate', 'v0', args, 3);
};

module.exports.end = function() {
    return Promise.resolve();
};