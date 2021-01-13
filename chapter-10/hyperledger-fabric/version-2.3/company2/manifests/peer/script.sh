#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying peer manifests..."
    echo "################################"
    # Peer private key
    kubectl ${CONDITION} secret generic comp2-peer-key --from-file=../../artifacts/crypto-config/peerOrganizations/company2/peers/peer0.company2/msp/keystore

    # Peer certificate
    kubectl ${CONDITION} configmap comp2-peer-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company2/peers/peer0.company2/msp/signcerts

    # Peer TLS certificate
    kubectl ${CONDITION} secret generic comp2-peer-tls --from-file=../../artifacts/crypto-config/peerOrganizations/company2/peers/peer0.company2/tls


    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting peer manifests..."
    echo "################################"
    kubectl delete secret comp2-peer-key
    kubectl delete configmap comp2-peer-crt
    kubectl delete secret comp2-peer-tls
    kubectl delete -f .

fi