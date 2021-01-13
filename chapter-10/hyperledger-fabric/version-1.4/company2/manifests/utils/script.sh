#!/bin/bash

CONDITION=$1


if [ "$CONDITION" == "create" ]; then

    echo "Deploying utils manifests..."

    #ORG Admin Certificate
    kubectl ${CONDITION} -f msp-admin-configMap.yaml


elif [ "$CONDITION" == "delete" ]; then

    echo "Deleting utils manifests..."
    kubectl delete -f .

fi