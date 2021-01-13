#!/bin/bash

CONDITION=$1



if [ "$CONDITION" == "create" ]; then
    echo "################################"
    echo "Deploying ca manifests..."
    echo "################################"
    #CA PrivateKey
    kubectl ${CONDITION} secret generic comp2-ca --from-file=../../artifacts/crypto-config/peerOrganizations/company2/ca/

    #CA Certificate
    kubectl ${CONDITION} configmap comp2-cacrt --from-file=../../artifacts/crypto-config/peerOrganizations/company2/ca/ca.company2-cert.pem

    #CA TLS Certificate
    kubectl ${CONDITION} configmap comp2-tlsca --from-file=../../artifacts/crypto-config/peerOrganizations/company2/tlsca/tlsca.company2-cert.pem

    #Deploy Services
    kubectl ${CONDITION} -f .

elif [ "$CONDITION" == "delete" ]; then
    echo "################################"
    echo "Deleting ca manifests..."
    echo "################################"
    kubectl delete secret comp2-ca
    kubectl delete configmap comp2-cacrt
    kubectl delete configmap comp2-tlsca
    kubectl delete -f .
    
fi