#!/bin/bash

CONDITION=$1


if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying orderer3 manifests..."
    echo "################################"
    # Orderer private key
    kubectl ${CONDITION} secret generic comp1-ordr3-key --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer3.company1/msp/keystore

    # Orderer certificate
    kubectl ${CONDITION} configmap comp1-ordr3-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer3.company1/msp/signcerts

    # Orderer TLS certificate
    kubectl ${CONDITION} secret generic comp1-ordr3-tls --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer3.company1/tls

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting orderer3 manifests..."
    echo "################################"
    kubectl delete secret comp1-ordr3-key
    kubectl delete configmap comp1-ordr3-crt
    kubectl delete secret comp1-ordr3-tls
    kubectl delete -f .

fi