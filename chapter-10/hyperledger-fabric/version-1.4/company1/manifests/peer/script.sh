#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying peer manifests..."
    echo "################################"
    # Peer private key
    kubectl ${CONDITION} secret generic comp1-peer-key --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer1.company1/msp/keystore

    # Peer certificate
    kubectl ${CONDITION} configmap comp1-peer-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer1.company1/msp/signcerts

    # Peer TLS certificate
    kubectl ${CONDITION} secret generic comp1-peer-tls --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer1.company1/tls


    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting peer manifests..."
    echo "################################"
    kubectl delete secret comp1-peer-key
    kubectl delete configmap comp1-peer-crt
    kubectl delete secret comp1-peer-tls
    kubectl delete -f .

fi