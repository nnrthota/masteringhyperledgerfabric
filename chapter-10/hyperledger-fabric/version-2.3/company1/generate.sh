#!/bin/bash
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
# Ask user for confirmation to proceed
function askProceed () {
  read -p "Continue? [Y/n] " ans
  case "$ans" in
    y|Y|"" )
      echo "proceeding ..."
    ;;
    n|N )
      echo "exiting..."
      exit 1
    ;;
    * )
      echo "invalid response"
      askProceed
    ;;
  esac
}


# Obtain CONTAINER_IDS and remove them
# TODO Might want to make this optional - could clear other containers
function clearContainers () {
  CONTAINER_IDS=$(docker ps -aq)
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    #docker rm -f $CONTAINER_IDS
    docker rmi -f $(docker images | grep dev | awk '{print $3}')
  fi
}

function generateCerts (){
  cd ..
  which cryptogen
  if [ "$?" -ne 0 ]; then
    echo "cryptogen tool not found. exiting"
    exit 1
  fi
  echo
  echo "##########################################################"
  echo "##### Generate certificates using cryptogen tool #########"
  echo "##########################################################"
  if [ -d "crypto-config" ]; then
    rm -Rf crypto-config
  fi
  cryptogen generate --config=./cryptogen.yaml
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate certificates..."
    exit 1
  fi
  echo
}
function generateChannelArtifacts() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi

  echo "##########################################################"
  echo "#########  Generating Orderer Genesis block ##############"
  echo "##########################################################"
  # Note: For some unknown reason (at least for now) the block file can't be
  # named orderer.genesis.block or the orderer will fail to launch!
  configtxgen -profile transportGroupOrdererGenesis -outputBlock ./artifacts/genesis.block -channelID syschannel
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate orderer genesis block..."
    exit 1
  fi
  echo
  echo "#################################################################"
  echo "### Generating channel configuration transaction 'transportchannel.tx' ###"
  echo "#################################################################"
  configtxgen -profile transportGroupChannel -outputCreateChannelTx ./artifacts/transportchannel.tx -channelID transportchannel
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi
}

function replacePrivateKey () {
  # sed on MacOSX does not support -i flag with a null extension. We will use
  # 't' for our back-up's extension and depete it at the end of the function
  echo "#################################################################"
  echo "#######    replace PrivateKey   ##########"
  echo "#################################################################"
  ARCH=`uname -s | grep Darwin`
  if [ "$ARCH" == "Darwin" ]; then
    OPTS="-it"
  else
    OPTS="-i"
  fi

  # The next steps will replace the template's contents with the
  # actual values of the private key file names for the two CAs.
  CURRENT_DIR=$PWD
  cd crypto-config/peerOrganizations/payer/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/CA1_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml
  # If MacOSX, remove the temporary backup of the docker-compose file
  if [ "$ARCH" == "Darwin" ]; then
    rm docker-compose-e2e.yamlt
  fi
}

# Generate the needed certificates, the genesis block and start the network.
function networkUp () {
  # generate artifacts if they don't exist
  CURRENT_DIR=$PWD
  cd artifacts
  if [ ! -d "crypto-config" ]; then
    generateCerts
    generateChannelArtifacts
    replacePrivateKey
  fi
      echo "#################################################################"
      echo "#######    Starting the network  ##########"
      echo "#################################################################"
      cd ..
      docker stack deploy --compose-file=docker-compose.yaml bpa
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to start network"
    exit 1
  fi
}
function networkDown () {
  echo "#################################################################"
  echo "#######    Stopping Docker containers  ##########"
  echo "#################################################################"
  docker stack remove bpa
  echo "#################################################################"
  echo "#######    Clearing Docker containers  ##########"
  echo "#################################################################"
  #Cleanup the chaincode containers
  clearContainers
}

function remove () {

    echo "#################################################################"
    echo "#######    Removing artifacts and cryptocertificates  ##########"
    echo "#################################################################"
    CURRENT_DIR=$PWD
    cd artifacts
    # remove orderer block and other channel configuration transactions and certs
    rm -rf *.block *.tx crypto-config

}

if [ "$1" = "-m" ];then	# supports old usage, muscle memory is powerful!
    shift
fi
MODE=$1;shift
# Determine whether starting, stopping, restarting or generating for announce
if [ "$MODE" == "up" ]; then
  askProceed
  clearContainers
  sleep 4
  networkUp
elif [ "$MODE" == "down" ]; then
  networkDown
elif [ "$MODE" == "remove" ]; then
  remove
else
  askProceed
  exit 1
fi
