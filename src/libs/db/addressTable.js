const db = require('./db');

module.exports = class AddressTable {
  constructor(name = 'db', dirPath = './') {
    this.database = new db.createDatabase(`${name}_addr`, dirPath);
  };

  async initialize() {
    await this.database.createIndex('address');
    return true;
  };

  async addPubkeyAddress(pubkey, hdkeyPath, address, addressType,
      lockingScript, extra = {}) {
    return await this.database.insert(
        {pubkey: pubkey, path: hdkeyPath, address: address, type: addressType,
          lockingScript: lockingScript, extra: extra},
        {address: address});
  };

  async addScriptAddress(script, address, addressType, lockingScript, isMultisig = false, pubkeyMap = {'': []}, extra = {}) {
    return await this.database.insert(
        {script: script, address: address, type: addressType,
          lockingScript: lockingScript, multisig: isMultisig,
          pubkeyMap: pubkeyMap, extra: extra},
        {address: address});
  };

  // disable update

  async deleteAll() {
    return await this.database.delete({}, {multi: true});
  };

  async deleteByPubkey(pubkey) {
    return await this.database.delete({pubkey: pubkey}, {multi: true});
  };
  async deleteByScript(script) {
    return await this.database.delete({script: script}, {multi: true});
  };
  async deleteByAddress(address) {
    return await this.database.delete({address: address});
  };

  async getAddress(address) {
    return await this.database.findOne({address: address});
  };

  async getAddressesAll(page = 1, perPage = 100) {
    return await this.database.find(page, perPage);
  };

  async getAddressesByPath(hdkeyPath) {
    return await this.database.find(query = {path: hdkeyPath});
  };

  async getAddressesByContainPath(hdkeyPath, page = 1, perPage = 100) {
    return await this.database.findSorted(query = {
      $where: function() {
        return (this.path && !(this.path.indexOf(hdkeyPath) == -1));
      },
    }, page, perPage);
  };

  async getPubkeyAddress(pubkey, addressType) {
    return await this.database.findOne({pubkey: pubkey, type: addressType});
  };
  async getPubkeyAddresses(pubkey) {
    return await this.database.find({pubkey: pubkey});
  };

  async getPubkeyAddressesAll(page = 1, perPage = 100) {
    return await this.database.findSorted(
        {pubkey: {$exists: true}}, page, perPage);
  };

  async getScriptAddress(script, addressType) {
    return await this.database.findOne({script: script, type: addressType});
  };
  async getScriptAddresses(script) {
    return await this.database.find({script: script});
  };

  async getScriptAddressesAll(page = 1, perPage = 100) {
    return await this.database.findSorted(
        {script: {$exists: true}}, page, perPage);
  };
};
