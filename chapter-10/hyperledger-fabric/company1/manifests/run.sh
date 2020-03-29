#!/bin/bash

CONDITION=$1

#Deploy All manifests in utils
cd utils
./script.sh ${CONDITION}
cd ..

cd ca
#Deploy All manifests in ca
./script.sh ${CONDITION}
cd ..

cd couch
#Deploy All manifests in couch
./script.sh ${CONDITION}
cd ..

cd orderer1
#Deploy All manifests in orderer1
./script.sh ${CONDITION}
cd ..

cd orderer2
#Deploy All manifests in orderer2
./script.sh ${CONDITION}
cd ..

cd orderer3
#Deploy All manifests in orderer3
./script.sh ${CONDITION}
cd ..

cd peer
#Deploy All manifests in peer
./script.sh ${CONDITION}
cd ..