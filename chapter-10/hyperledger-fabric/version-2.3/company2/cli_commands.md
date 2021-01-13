#### CREATE CHANNEL:
```bash
peer channel create -o orderer1:30050 -c transportchannel -f /etc/hyperledger/configtx/channel/transportchannel.tx --tls --cafile /etc/hyperledger/crypto/orderer/tls/ca.crt
``` 
#### JOIN CHANNEL
```bash
peer channel join -b transportchannel_0.block --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
``` 
#### INSTALL CHAINCODE
```bash
peer chaincode install -n shipment -v v0 -l golang -p github.com/chaincode/ --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
``` 
#### INSTANTIATE CHAINCODE
```bash
peer chaincode instantiate -o orderer1:30050 -C transportchannel -n shipment -l golang -v v0 -c '{"Args":[""]}' --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
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

peer lifecycle chaincode approveformyorg -o orderer1:30050 --ordererTLSHostnameOverride orderer1 --channelID transportchannel --name ship --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem --signature-policy "OR('company1MSP.member', 'company2MSP.member')"
```

#### CHAINCODE COMMIT READINESS
```bash
peer lifecycle chaincode checkcommitreadiness --channelID transportchannel --name ship --version 1.0 --sequence 1 --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt --output json
```
#### CHAINCODE COMMIT 
```bash
peer lifecycle chaincode commit -o orderer2:30060 --ordererTLSHostnameOverride orderer1 --channelID transportchannel --name ship --version 1.0 --sequence 1 --tls --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem --peerAddresses company1-peer:30051 --tlsRootCertFiles /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem --peerAddresses company2-peer:30061 --tlsRootCertFiles /etc/hyperledger/crypto/peer/tls/ca.crt --signature-policy "OR('company1MSP.member', 'company2MSP.member')"
```

#### CHAINCODE QUERY COMMIT 
```bash
peer lifecycle chaincode querycommitted --channelID transportchannel --name ship --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem
```

#### INVOKE
```bash
peer chaincode invoke -o orderer1:30050  --waitForEvent --tls --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem -C transportchannel -n ship -c '{"Args":["createShipment", "{\n  \"shipmentID\": \"1245343636\",\n  \"deliveryCountry\": \"Spain\",\n  \"sourceCountry\": \"India\",\n  \"shipmentWeight\":\"10,000kg\",\n  \"deliveryLocation\": \"Spain, Madrid, sol\",\n  \"sourceLocation\":\"India, Hyderabad, HitechCity\",\n  \"clearenceStatus\":\"PENDING\",\n  \"shipmentRange\": \"Origin\",\n  \"status\":\"CREATED\",\n  \"location\":\"India\",\n  \"latitude\":\"24524624426\",\n  \"longitude\":\"245245425\"\n}"]}' --peerAddresses company1-peer:30051 --tlsRootCertFiles /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem --peerAddresses company2-peer:30061 --tlsRootCertFiles /etc/hyperledger/crypto/peer/tls/ca.crt
``` 
```bash
peer chaincode invoke -o orderer1:30050  --waitForEvent --tls --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem -C transportchannel -n shipment -c '{"Args":["update", "{\n  \"shipmentID\": \"1245343636\",\n  \"deliveryCountry\": \"Spain\",\n  \"sourceCountry\": \"India\",\n  \"shipmentWeight\":\"10,000kg\",\n  \"deliveryLocation\": \"Spain, Madrid, sol\",\n  \"sourceLocation\":\"India, Hyderabad, HitechCity\",\n  \"clearenceStatus\":\"APPROVED\",\n  \"shipmentRange\": \"Origin\",\n  \"status\":\"DELIVERED\",\n  \"location\":\"Madrid\",\n  \"latitude\":\"7832562875\",\n  \"longitude\":\"274657929\"\n}"]}' --peerAddresses company1-peer:30051 --tlsRootCertFiles /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem --peerAddresses company2-peer:30061 --tlsRootCertFiles /etc/hyperledger/crypto/peer/tls/ca.crt
``` 
#### QUERY
```bash
peer chaincode query -C transportchannel -n ship -c '{"Args":["query","1245343636"]}' --tls --cafile /etc/hyperledger/crypto/peer/tls/ca.crt
```
#### FETCH BLOCK
```bash
peer channel fetch 0 -o orderer1:30050 -c transportchannel --tls --cafile /etc/hyperledger/crypto/orderer/tls/tlsca.company1-cert.pem
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
peer chaincode query -C "transportchannel" -n qscc -c '{"Args":["GetTransactionByID", "transportchannel", "8b5cfc68ea1678e3807b2887a4cd8e5c88500a427901f683ab43ffa3e32e6a67"]}'
```
