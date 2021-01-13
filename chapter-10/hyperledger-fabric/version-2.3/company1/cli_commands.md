#### CREATE CHANNEL:
```bash
peer channel create -o orderer1:30050 -c transportchannel -f /etc/hyperledger/configtx/channel/transportchannel.tx --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
``` 
#### JOIN CHANNEL
```bash
peer channel join -b transportchannel.block --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
```  

#### CHAINCODE PACKAGE
```bash
peer lifecycle chaincode package ship.tar.gz --path /opt/gopath/src/github.com/chll/ --lang golang --label ship_1.0
```

#### CHAINCODE INSTALL
```bash
peer lifecycle chaincode install ship.tar.gz
```

#### CHAINCODE APPROVE
```bash
export CC_PACKAGE_ID=ship_1.0:14ed243ccc04828c4a74ff8954726e180380a9e63ca4eeda48dd334c47a67e36

peer lifecycle chaincode approveformyorg -o orderer1:30050 --ordererTLSHostnameOverride orderer1 --channelID transportchannel --name ship --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt --signature-policy "OR('company1MSP.member', 'company2MSP.member')"
```

#### CHAINCODE COMMIT READINESS
```bash
peer lifecycle chaincode checkcommitreadiness --channelID transportchannel --name ship --version 1.0 --sequence 1 --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt --output json
```

#### CHAINCODE COMMIT 
```bash
peer lifecycle chaincode commit -o orderer1:30050 --ordererTLSHostnameOverride orderer1 --channelID transportchannel --name ship --version 1.0 --sequence 1 --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt --peerAddresses company1-peer:30051 --tlsRootCertFiles /etc/hyperledger/crypto/peer/tls/ca.crt --signature-policy "OR('company1MSP.member', 'company2MSP.member')"
```

#### CHAINCODE QUERY COMITTED 
```bash
peer lifecycle chaincode querycommitted --channelID transportchannel --name ship --cafile /etc/hyperledger/crypto/peer/tls/ca.crt 
```

#### INVOKE
```bash
peer chaincode invoke -o orderer1:30050  --waitForEvent --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt -C transportchannel -n ship -c '{"Args":["createShipment", "{\n  \"shipmentID\": \"1245343636\",\n  \"deliveryCountry\": \"Spain\",\n  \"sourceCountry\": \"India\",\n  \"shipmentWeight\":\"10,000kg\",\n  \"deliveryLocation\": \"Spain, Madrid, sol\",\n  \"sourceLocation\":\"India, Hyderabad, HitechCity\",\n  \"clearenceStatus\":\"PENDING\",\n  \"shipmentRange\": \"Origin\",\n  \"status\":\"CREATED\",\n  \"location\":\"India\",\n  \"latitude\":\"24524624426\",\n  \"longitude\":\"245245425\"\n}"]}'
``` 
#### QUERY
```bash
peer chaincode query -C transportchannel -n ship -c '{"Args":["query","1245343636"]}' --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
```
#### FETCH BLOCK
```bash
peer channel fetch 2 -o orderer1:30050 -c transportchannel --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
```
#### DECODE BLOCK
```bash
> configtxlator proto_decode --type 'common.Block' --input 'transportchannel_2.block' --output 'block.json'
> curl -X POST --data-binary @transportchannel_2.block  http://127.0.0.1:7059/protolator/decode/common.Block > block.json
```
#### LIST CHAINCODES
```bash
peer chaincode list --installed
peer chaincode list --channelID transportchannel --instantiated
```
#### QUERY CHANNEL DETAILS
```bash
peer channel getinfo --channelID transportchannel
```
#### QUERY CHANNEL TX DETAILS
```bash
peer chaincode query -C "transportchannel" -n qscc -c '{"Args":["GetBlockByNumber", "transportchannel", "3"]}'
peer chaincode query -C "transportchannel" -n qscc -c '{"Args":["GetTransactionByID", "transportchannel", "cd10602ca837ec2b5c1fba509ec772d8e1de1dadacf75c038909e677763b91b8"]}'
```
