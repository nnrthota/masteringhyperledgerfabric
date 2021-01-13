#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying peer manifests..."
    echo "################################"
    # Peer private key
    kubectl ${CONDITION} secret generic comp1-admin-key --from-file=../../artifacts/crypto-config/peerOrganizations/company1/users/Admin@company1/msp/keystore

    # Peer certificate
    kubectl ${CONDITION} configmap comp1-admin-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company1/users/Admin@company1/msp/signcerts

    # chaincode
    kubectl ${CONDITION} configmap chaincode --from-file=./chaincode

    # channel tx
    kubectl ${CONDITION} configmap channel-tx --from-file=../../artifacts/transportchannel.tx

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting peer manifests..."
    echo "################################"
    kubectl delete configmap channel-tx
    kubectl delete configmap chaincode
    kubectl delete secret comp1-admin-key
    kubectl delete configmap comp1-admin-crt
    kubectl delete -f .

fi