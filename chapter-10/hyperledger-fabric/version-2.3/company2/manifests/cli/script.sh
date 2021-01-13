#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying peer manifests..."
    echo "################################"
    # Peer private key
    kubectl ${CONDITION} secret generic comp2-admin-key --from-file=../../artifacts/crypto-config/peerOrganizations/company2/users/Admin@company2/msp/keystore

    # Peer certificate
    kubectl ${CONDITION} configmap comp2-admin-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company2/users/Admin@company2/msp/signcerts

    # chaincode
    kubectl ${CONDITION} configmap comp2-chaincode --from-file=./chaincode

    # channel tx
    kubectl ${CONDITION} configmap comp2-channel-tx --from-file=../../artifacts/transportchannel.tx

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting peer manifests..."
    echo "################################"
    kubectl delete configmap comp2-channel-tx
    kubectl delete configmap comp2-chaincode
    kubectl delete secret comp2-admin-key
    kubectl delete configmap comp2-admin-crt
    kubectl delete -f .

fi