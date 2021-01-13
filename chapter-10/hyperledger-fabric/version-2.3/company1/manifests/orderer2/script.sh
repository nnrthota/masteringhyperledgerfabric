#!/bin/bash

CONDITION=$1


if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying orderer2 manifests..."
    echo "################################"
    # Orderer private key
    kubectl ${CONDITION} secret generic comp1-ordr2-key --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer2.company1/msp/keystore

    # Orderer certificate
    kubectl ${CONDITION} configmap comp1-ordr2-crt --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer2.company1/msp/signcerts

    # Orderer TLS certificate
    kubectl ${CONDITION} secret generic comp1-ordr2-tls --from-file=../../artifacts/crypto-config/peerOrganizations/company1/peers/peer2.company1/tls

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "deleting orderer2 manifests..."
    echo "################################"
    kubectl delete secret comp1-ordr2-key
    kubectl delete configmap comp1-ordr2-crt
    kubectl delete secret comp1-ordr2-tls
    kubectl delete -f .

fi