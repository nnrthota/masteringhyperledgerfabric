'use strict';

module.exports.info = 'Querying a rates.';

//const helper = require('./helper');

let txIndex = 0;
let limitIndex, bc, contx;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    limitIndex = args.assets;

    //await helper.createCar(bc, contx, args);

    return Promise.resolve();
};

module.exports.run = function() {
    txIndex++;
    let carNumber = 'Client' + contx.clientIdx + '_CAR' + txIndex.toString();

    let args = {
        chaincodeFunction: 'queryRate',
        chaincodeArguments: ["1"]
    };

    if (txIndex === limitIndex) {
        txIndex = 0;
    }

    return bc.bcObj.querySmartContract(contx, 'rate', 'v0', args, 3);
};

module.exports.end = function() {
    return Promise.resolve();
};