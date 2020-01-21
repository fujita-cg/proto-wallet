#!/bin/bash -u

# while :; do sleep 10; done

bitcoind --regtest
bitcoin-cli --regtest ping > /dev/null 2>&1
while [ $? -ne 0 ]
do
  bitcoin-cli --regtest ping > /dev/null 2>&1
done

echo "start bitcoin node"

elementsd -chain=liquidregtest
elements-cli -chain=liquidregtest ping > /dev/null 2>&1
while [ $? -ne 0 ]
do
  elements-cli -chain=liquidregtest ping > /dev/null 2>&1
done

echo "start elements node"

set -e

cd /root/wallet-test/
npm install && npm test