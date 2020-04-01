const agent = require('superagent-promise')(require('superagent'), Promise);

let original_config_json = null;
let updated_config_json = null;
let updated_config_binary = null;
let original_config_proto = null;

const config_envelope = await channel.getChannelConfig();
original_config_proto = config_envelope.config.toBuffer();
let response = await agent.post('http://localhost:7059/protolator/decode/common.Config',
        original_config_proto)
    .buffer();
original_config_json = response.text.toString();
updated_config_json = JSON.parse(original_config_json);

var neworg_config_json = {} //Please put your updated config json here 

updated_config_json.channel_group.groups.Application.groups["new_org_name"] = neworg_config_json

var bytesData = await agent.post('http://localhost:7059/protolator/encode/common.Config', updated_config_json)
    .buffer();
updated_config_binary = bytesData.body;

const formData = {
    channel: channelName,
    original: {
        value: original_config_proto,
        options: {
            filename: 'original.proto',
            contentType: 'application/octet-stream'
        }
    },
    updated: {
        value: updated_config_binary,
        options: {
            filename: 'updated.proto',
            contentType: 'application/octet-stream'
        }
    }
};

var delta_change = await agent.post({
    url: 'http://localhost:7059/configtxlator/compute/update-from-configs',
    encoding: null,
    headers: {
        accept: '/',
        expect: '100-continue'
    },
    formData: formData
})

const finalData = Buffer.from(delta_change, 'binary');

var signatures = [client.signChannelConfig(finalData)]
request = {
    config: finalData,
    signatures: signatures,
    name: channel_name,
    orderer: orderer,
    txId: client.newTransactionID()
};
// this will send the update request to the orderer
result = await client.updateChannel(request);