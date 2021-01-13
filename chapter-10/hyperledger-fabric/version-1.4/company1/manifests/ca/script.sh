#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying ca manifests..."
    echo "################################"
    #CA PrivateKey
    kubectl ${CONDITION} secret generic company1-ca --from-file=../../artifacts/crypto-config/peerOrganizations/company1/ca/

    #CA Certificate
    kubectl ${CONDITION} configmap company1-cacrt --from-file=../../artifacts/crypto-config/peerOrganizations/company1/ca/ca.company1-cert.pem

    #CA TLS Certificate
    kubectl ${CONDITION} configmap company1-tlsca --from-file=../../artifacts/crypto-config/peerOrganizations/company1/tlsca/tlsca.company1-cert.pem

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "Deleting ca manifests..."
    echo "################################"
    kubectl delete secret company1-ca
    kubectl delete configmap company1-cacrt
    kubectl delete configmap company1-tlsca
    kubectl delete -f .
    
fi