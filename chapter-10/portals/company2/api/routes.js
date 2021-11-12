var express = require("express");
var router = express.Router();
require("dotenv").config();
var hfc = require("fabric-client");

//Fabric-helpers
var helper = require("../app/helper.js");
var createChannel = require("../app/create-channel.js");
var join = require("../app/join-channel.js");
var install = require("../app/install-chaincode.js");
var instantiate = require("../app/instantiate-chaincode.js");
var invoke = require("../app/invoke-transaction.js");
var query = require("../app/query.js");
var helper = require("../app/helper.js");

//logger
var logger = helper.getLogger("Routes");

function getErrorMessage(field) {
  var response = {
    success: false,
    message: field + " field is missing or Invalid in the request",
  };
  return response;
}

// Register and enroll user
router.post("/createUser", async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug("End point : /users");
  logger.debug("User name : " + username);
  logger.debug("Org name  : " + orgName);
  if (!username) {
    res.json(getErrorMessage("'username'"));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage("'orgName'"));
    return;
  }
  let response = await helper.getRegisteredUser(username, orgName, true);
  logger.debug(
    "-- returned from registering the username %s for organization %s",
    username,
    orgName
  );
  if (response && typeof response !== "string") {
    logger.debug(
      "Successfully registered the username %s for organization %s",
      username,
      orgName
    );
    res.json(response);
  } else {
    logger.debug(
      "Failed to register the username %s for organization %s with::%s",
      username,
      orgName,
      response
    );
    res.json({
      success: false,
      message: response,
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// --BPA ADMIN TASKS START--//////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Create Channel
router.post("/createChannel", async function (req, res) {
  logger.info("<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>");
  logger.debug("End point : /channels");
  var channelName = req.body.channelName;
  var channelConfigPath = req.body.channelConfigPath;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("Channel name : " + channelName);
  logger.debug("channelConfigPath : " + channelConfigPath); //../artifacts/channel/mychannel.tx
  logger.debug("orgName : " + orgName);
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!channelConfigPath) {
    res.json(getErrorMessage("'channelConfigPath'"));
    return;
  }

  let message = await createChannel.createChannel(
    channelName,
    channelConfigPath,
    userName,
    orgName
  );
  res.send(message);
});
// Join Channel
router.post("/joinPeers", async function (req, res) {
  logger.info("<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>");
  logger.debug("End point : /joinPeers");
  var channelName = req.body.channelName;
  var peers = req.body.peers;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("channelName : " + channelName);
  logger.debug("peers : " + peers);
  logger.debug("userName :" + userName);
  logger.debug("orgName:" + orgName);

  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!peers || peers.length == 0) {
    res.json(getErrorMessage("'peers'"));
    return;
  }

  let message = await join.joinChannel(channelName, peers, userName, orgName);
  const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
  await timeout(1000);
  res.send(message);
});

// Install chaincode on target peers
router.post("/installChaincode", async function (req, res) {
  logger.debug("==================== INSTALL CHAINCODE ==================");
  var peers = req.body.peers;
  var chaincodeName = req.body.chaincodeName;
  var chaincodePath = req.body.chaincodePath;
  var chaincodeVersion = req.body.chaincodeVersion;
  var chaincodeType = req.body.chaincodeType;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("peers : " + peers); // target peers list
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("chaincodePath  : " + chaincodePath);
  logger.debug("chaincodeVersion  : " + chaincodeVersion);
  logger.debug("chaincodeType  : " + chaincodeType);
  if (!peers || peers.length == 0) {
    res.json(getErrorMessage("'peers'"));
    return;
  }
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!chaincodePath) {
    res.json(getErrorMessage("'chaincodePath'"));
    return;
  }
  if (!chaincodeVersion) {
    res.json(getErrorMessage("'chaincodeVersion'"));
    return;
  }
  if (!chaincodeType) {
    res.json(getErrorMessage("'chaincodeType'"));
    return;
  }
  let message = await install.installChaincode(
    peers,
    chaincodeName,
    chaincodePath,
    chaincodeVersion,
    chaincodeType,
    userName,
    orgName
  );
  res.send(message);
});

// Instantiate chaincode on target peers
router.post("/instantiateChaincode", async function (req, res) {
  logger.debug("==================== INSTANTIATE CHAINCODE ==================");
  var peers = req.body.peers;
  var chaincodeName = req.body.chaincodeName;
  var chaincodeVersion = req.body.chaincodeVersion;
  var channelName = req.body.channelName;
  var chaincodeType = req.body.chaincodeType;
  var fcn = req.body.fcn;
  var args = req.body.args;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("peers  : " + peers);
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("chaincodeVersion  : " + chaincodeVersion);
  logger.debug("chaincodeType  : " + chaincodeType);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'"));
    return;
  }
  if (!chaincodeVersion) {
    res.json(getErrorMessage("'chaincodeVersion'"));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'"));
    return;
  }
  if (!chaincodeType) {
    res.json(getErrorMessage("'chaincodeType'"));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'"));
    return;
  }

  let message = await instantiate.instantiateChaincode(
    peers,
    channelName,
    chaincodeName,
    chaincodeVersion,
    chaincodeType,
    fcn,
    args,
    userName,
    orgName
  );
  res.send(message);
});

router.post("/query", async function (req, res) {
  logger.debug("==================== QUERY ON CHAINCODE ==================");
  var chaincodeName = req.body.chaincodeName;
  var channelName = req.body.channelName;
  var fcn = req.body.fcn;
  var args = req.body.args;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'", res));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'", res));
    return;
  }
  if (!fcn) {
    res.json(getErrorMessage("'fcn'", res));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'", res));
    return;
  }

  let message = await query.queryChaincode(
    channelName,
    chaincodeName,
    args,
    fcn,
    userName,
    orgName
  );
  message = JSON.parse(message);
  res.send(message);
});
router.post("/invoke", async function (req, res) {
  logger.debug("==================== INVOKE ON CHAINCODE ==================");
  var chaincodeName = req.body.chaincodeName;
  var channelName = req.body.channelName;
  var fcn = req.body.fcn;
  var args = req.body.args;
  var userName = req.body.userName;
  var orgName = req.body.orgName;
  logger.debug("channelName  : " + channelName);
  logger.debug("chaincodeName : " + chaincodeName);
  logger.debug("fcn  : " + fcn);
  logger.debug("args  : " + args);
  if (!chaincodeName) {
    res.json(getErrorMessage("'chaincodeName'", res));
    return;
  }
  if (!channelName) {
    res.json(getErrorMessage("'channelName'", res));
    return;
  }
  if (!fcn) {
    res.json(getErrorMessage("'fcn'", res));
    return;
  }
  if (!args) {
    res.json(getErrorMessage("'args'", res));
    return;
  }
  let message = await invoke.invokeChaincode(
    channelName,
    chaincodeName,
    fcn,
    args,
    userName,
    orgName
  );
  res.send(message);
});

module.exports = router;
