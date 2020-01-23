const db = require('./db');
const KeyNetworkType = 'network';
const KeyBip32Count = 'bip32Count';
const KeyBip32FeeCount = 'bip32FeeCount';
const KeyBlindCount = 'blindCount';

module.exports = class ConfigTable {
  constructor(name = 'db', dirPath = './') {
    this.database = new db.createDatabase(`${name}_config`, dirPath);
  }

  async initialize(networkType = 'regtest') {
    await this.database.createIndex('key');
    const nw = await this.getNetworkType();
    if (nw === networkType) {
      return true;
    }

    let ret = await this.database.insert(
        {key: KeyNetworkType, value: networkType},
        {key: KeyNetworkType});
    if (ret === false) {
      return false;
    }
    // check wallet key?
    ret = await this.database.insert(
        {key: KeyBip32Count, value: 0}, {key: KeyBip32Count});
    if (ret === false) {
      return false;
    }
    ret = await this.database.insert(
        {key: KeyBip32FeeCount, value: 0}, {key: KeyBip32FeeCount});
    if (ret === false) {
      return false;
    }
    ret = await this.database.insert(
        {key: KeyBlindCount, value: 0}, {key: KeyBlindCount});
    if (ret === false) {
      return false;
    }
    return true;
  }

  // disable Add, Delete

  async updateBip32Count(count) {
    return await this.database.update(
        {key: KeyBip32Count}, {$set: {value: count}});
  };

  async updateBip32FeeCount(count) {
    return await this.database.update(
        {key: KeyBip32FeeCount}, {$set: {value: count}});
  };

  async updateBlindingKeyCount(count) {
    return await this.database.update(
        {key: KeyBlindCount}, {$set: {value: count}});
  };


  async getNetworkType() {
    const ret = await this.database.findOne(query = {key: KeyNetworkType});
    if (!ret) {
      return false;
    }
    return ret.value;
  };

  async getBip32Count() {
    const ret = await this.database.findOne(query = {key: KeyBip32Count});
    if (!ret) {
      return false;
    }
    return ret.value;
  };

  async getBip32FeeCount() {
    const ret = await this.database.findOne(query = {key: KeyBip32FeeCount});
    if (!ret) {
      return false;
    }
    return ret.value;
  };

  async getBlindingKeyCount() {
    const ret = await this.database.findOne(query = {key: KeyBlindCount});
    if (!ret) {
      return false;
    }
    return ret.value;
  };
};
