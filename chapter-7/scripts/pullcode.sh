#!/bin/bash
echo "Deploying stage your_repo"
mkdir chaincode
cd chaincode \
&& git pull origin master \
&& echo "your_repo pulled the latest code successfully"