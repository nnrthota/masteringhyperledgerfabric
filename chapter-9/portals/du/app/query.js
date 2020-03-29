var util = require('util');
var helper = require('./helper.js');
var logger = helper.getLogger('Query');



var queryChaincode = async function(channelName, chaincodeName, args, fcn, username, org_name) {
  try {
    // first setup the client for this org
    var client = await helper.getClientForOrg(org_name, username);
    logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
    var channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format('Channel %s was not defined in the connection profile', channelName);
      logger.error(message);
      throw new Error(message);
    }

    // send query
    var request = {
      //targets: [peer], //queryByChaincode allows for multiple targets
      chaincodeId: chaincodeName,
      fcn: fcn,
      args: args
    };
    let response_payloads = await channel.queryByChaincode(request);
    if (response_payloads) {
      for (let i = 0; i < response_payloads.length; i++) {
        //logger.info(args[0] + response_payloads[i].toString('utf8'));
      }
      return response_payloads[0].toString('utf8');
    } else {
      logger.error('response_payloads is null');
      return 'response_payloads is null';
    }
  } catch (error) {
    logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
    return {
      error: error.toString()
    }
  }
};


var getTransactionByID = async function(peer, channelName, trxnID, username, org_name) {
  try {
    // first setup the client for this org
    var client = await helper.getClientForOrg(org_name, username);
    logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
    var channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format('Channel %s was not defined in the connection profile', channelName);
      logger.error(message);
      throw new Error(message);
    }

    let response_payload = await channel.queryTransaction(trxnID, peer);
    if (response_payload) {
      logger.debug(response_payload);
      return response_payload;
    } else {
      logger.error('response_payload is null');
      return 'response_payload is null';
    }
  } catch (error) {
    logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
    return error.toString();
  }
};




exports.queryChaincode = queryChaincode;
exports.getTransactionByID = getTransactionByID;