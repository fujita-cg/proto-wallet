const Wallet = require('./libs/walletService');

module.exports = class WalletManager {
  constructor(nodeConfigFile, dirPath = './', network = 'regtest',
      seed = '', masterXprivkey = '', englishMnemonic = '') {
    this.dirName = dirPath;
    this.walletList = {};
    this.masterXprivkey = masterXprivkey;
    // FIXME calc xpriv(m/44'/(nettype)')
    this.xprivkey = masterXprivkey; // conv to m/44'/(nettype)
    this.seed = seed;
    this.englishMnemonic = englishMnemonic;
    // FIXME conv from nodeConfigFile
    this.nodeConfigMap = nodeConfigFile;
  };

  async createWallet(targetNodeType, userIndex, userNamePrefix = 'user') {
    // wallet is btc or elements support.
    // (multi support is exist pubkey management risk.)
    const walletObj = new Wallet(userNamePrefix, userIndex,
        this.dirName, this.network, this.xprivkey,
        this.nodeConfigMap[targetNodeType], this);
    await walletObj.initialize();
    this.walletList.push(userName, walletObj);
    return walletObj;
  };

  getWallet(username) {
    return this.walletList[username];
  };

  async CheckUpdateBlock() {
    const isUpdate = false;
    const blockInfos = {};

    // FIXME analyze update block
    /*
      {
        hash: '',
        count: '',
        confirmation: -1,
        utxo: {
          txid: '',
          vout: '',
          outpoint: '',
          lockingScript: '',
        },
        usingTxs: {
          txid: '',
          vout: '',
          outpoint: '',
        },
      };
    */

    if (isUpdate) {
      for (const key in walletList) {
        if (walletList[key]) {
          walletList[key].CallbackUpdateBlock(blockInfos);
        }
      }
    }
  }

  async generate(targetNodeType) {
    // FIXME generatetoaddress 100 count.
    // address is (m/44'/(nettype)'/9223372036854775807'/1/0)
  };

  async getTransaction(targetNodeType, tx) {
    // TODO priority is low.
  };

  async getRawTransaction(targetNodeType, tx) {
    // TODO priority is low.
  };

  async getTxOut(targetNodeType, tx) {
    // TODO priority is low.
  };

  async gettransaction(targetNodeType, tx) {
    // TODO priority is low.
  };

  async getBlockCount(targetNodeType) {
    // FIXME
  };

  async getBlock(targetNodeType, count) {
    // TODO priority is low.
  };

  async getBlockHash(targetNodeType, count) {
    // TODO priority is low.
  };

  async getMemPoolInfo(targetNodeType) {
    // TODO priority is low.
  };

  async getRawMemPool(targetNodeType) {
    // TODO priority is low.
  };

  async generateToAddress(targetNodeType, address) {
    // FIXME
  };

  async sendRawTransaction(targetNodeType, tx) {
    // FIXME
  };

  async stop(targetNodeType) {
    // TODO priority is low.
  };
};
