const DbSvc = require('./databaseService');
const AddressSvc = require('./addressService');
const UtxoSvc = require('./utxoService');
const RpcClient = require('./rpc-client/jsonrpcClient');

module.exports = class Wallet {
  constructor(userNamePrefix, userIndex, dirPath, network,
      masterXprivkey, nodeConfig, manager) {
    if (isNaN(userIndex)) {
      throw new Error('Wallet userIndex is number only.');
    }
    this.dirName = dirPath;
    this.dbName = `${userNamePrefix}${userIndex}_${network}`;
    this.userIndex = userIndex;
    this.network = network;
    this.nodeConfig = nodeConfig;
    this.masterXprivkey = masterXprivkey; // xpriv(m/44'/(nettype)')
    this.manager = manager;

    const conn = RpcClient.createConnection(nodeConfig.host,
        nodeConfig.port, nodeConfig.user, nodeConfig.password, this.dbName);
    if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
      this.client = new RpcClient.BitcoinCli(conn);
      this.isElements = false;
    } else {
      this.client = new RpcClient.ElementsCli(conn);
      this.isElements = true;
    }

    this.dbSvc = new DbSvc(this.dbName, dirPath, network);
    this.addrSvc = new AddressSvc(this.dbSvc);
    this.utxoSvc = new UtxoSvc(this.dbSvc, this.addrSvc, this.client);
  };

  async initialize() {
    if (this.dbSvc.initialize() === false) {
      return false;
    }
    if (this.addrSvc.initialize(this.network, this.masterXprivkey) === false) {
      return false;
    }
    if (this.utxoSvc.initialize(this.network, this.masterXprivkey) === false) {
      return false;
    }
    return true;
  };

  async CallbackUpdateBlock(blockInfos) {
    utxoSvc.changeState(blockInfos);
  }

  // FIXME implements API

  async generate(count) {
    // FIXME getFeeAddress from AddressMgr
    // address is (masterXprivkey/userIndex'/1/feeCounter)
    // return: satoshiAmount
  };

  async GenerateFund(satoshiAmount) {
    // rpc connection.
    // use generatetoaddress
  }

  async SendToAddress(satoshiAmount, hdKeyPath = '', unmanagedAddress = '') {
    // rpc connection.
    // use generatetoaddress
  }

  async GetNewAddress(addressType = 'p2wpkh', script = '') {
    // generateAddress from AddressMgr
  }

  async GenerateKey(wif = true) {
    // TODO priority is low.
  }

  async CreateNewAddress(addressType = 'p2wpkh') {
    // TODO priority is low.
  }

  async GetAddressInfo(address) {
  }

  async AddMultisigAddress(pubkeys = [], requireNum = 1) {
  }

  async GetScriptAddress(script, addressType = 'p2wsh') {
    // rpc connection.
    // use generatetoaddress
  }

  async dumpPrivkey(address = '', pubkey = '') {
  }

  async estimateSmartFee(feeSetting = '') {
    // TODO priority is low.
  }

  async getBalance(address = '', asset = '') {
  }

  async listUnspent(address = '', asset = '') {
  }

  async setPayTxFee(minimumFeeAmount = 0) {
    // TODO priority is low.
  }

  async setRelayFee(relayFeeAmount = 0) {
    // TODO priority is low.
  }

  async validateAddress(address = '') {
    // TODO priority is low.
  }

  async decoderawtransaction(tx) {
  }

  async fundrawtransaction(tx) {
  }

  async importaddress(address = '', pubkey = '', privkeyWif = '') {
  }

  async sendRawTransaction(tx) {
    this.manager.sendRawTransaction(this.nodeConfig, tx);
  };
};
