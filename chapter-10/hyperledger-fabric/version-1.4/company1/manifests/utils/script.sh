#!/bin/bash

CONDITION=$1


if [ "$CONDITION" == "create" ]; then

    echo "Deploying utils manifests..."

    #ORG Admin Certificate
    kubectl ${CONDITION} -f msp-admin-configMap.yaml

    # Orderer genesis block
    kubectl ${CONDITION} configmap genesis --from-file=../../artifacts/genesis.block

elif [ "$CONDITION" == "delete" ]; then

    echo "Deleting utils manifests..."
    kubectl delete configmap genesis
    kubectl delete -f .

fi