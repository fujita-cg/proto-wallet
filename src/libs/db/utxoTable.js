const db = require('./db');

module.exports = class UtxoTable {
  constructor(name = 'db', dirPath = './') {
    this.database = new db.createDatabase(`${name}_utxo`, dirPath);
  };

  async initialize() {
    await this.database.createIndex('outpoint');
    return true;
  };

  async addUtxo(txid, vout, amount, address, descriptor, lockingScript,
      blockHash = '', blockHeight = -1, asset = '', confidentialKey = '',
      assetCommitment = '', amountCommitment = '', extend = {}) {
    let mapData = {};
    const outpoint = `${txid},${vout}`;
    if (asset === '') {
      mapData = {
        outpoint: outpoint, txid: txid, vout: vout,
        amount: amount, address: address, descriptor: descriptor,
        lockingScript: lockingScript, blockHash: blockHash,
        blockHeight: blockHeight, spent: false,
        extend: extend};
    } else {
      mapData = {
        outpoint: outpoint, txid: txid, vout: vout,
        amount: amount, address: address, descriptor: descriptor,
        lockingScript: lockingScript, blockHash: blockHash,
        blockHeight: blockHeight, asset: asset,
        confidentialKey: confidentialKey,
        assetCommitment: assetCommitment,
        amountCommitment: amountCommitment,
        spent: false, extend: extend};
    }
    return await this.database.insert(mapData, {outpoint: outpoint});
  };

  async updateBlockInfo(outpoint, blockHash, blockHeight, confirm) {
    return await this.database.update(
        {outpoint: outpoint}, {$set: {
          blockHash: blockHash,
          blockHeight: blockHeight,
        }});
  };

  async updateSpentable(outpoint, spent = true) {
    return await this.database.update(
        {outpoint: outpoint}, {$set: {
          spent: spent,
        }});
  };

  async deleteAll() {
    return await this.database.delete({}, {multi: true});
  };

  async deleteByOutpoint(outpoint) {
    return await this.database.delete({outpoint: outpoint});
  };

  async deleteByBlock(blockHash) {
    return await this.database.delete({blockHash: blockHash}, {multi: true});
  };

  async getUtxoCount() {
    return await this.database.count({});
  };

  async getUtxoCountInBlock(blockHash) {
    return await this.database.count({blockHash: blockHash});
  };

  async getUtxoCountOutsideBlock() {
    return await this.database.count({blockHash: ''});
  };

  async getUtxoByOutpoint(outpoint) {
    return await this.database.findOne({outpoint: outpoint});
  };

  async getUtxos(page = 1, perPage = 100) {
    return await this.database.findSorted({}, page, perPage);
  };

  async getUtxosByBlock(blockHash = '', page = 1, perPage = 100) {
    return await this.database.findSorted(
        {blockHash: blockHash}, page, perPage);
  };

  async getUtxosByAddress(address, page = 1, perPage = 100) {
    return await this.database.findSorted({address: address}, page, perPage);
  };

  async getUtxosByAsset(asset, page = 1, perPage = 100) {
    return await this.database.findSorted({asset: asset}, page, perPage);
  };

  async getUtxosUnspentable(page = 1, perPage = 100) {
    return await this.database.findSorted({spent: false}, page, perPage);
  };

  async getUtxosBlockHeightUnspentable(maxBlockHeight,
      page = 1, perPage = 100) {
    return await this.database.findSorted({$where: function() {
      return ((!this.spent) && (this.blockHeight !== -1) &&
              (this.blockHeight <= maxBlockHeight));
    }}, page, perPage);
  };

  // elements only
  async getUtxosBlindUnspentable(maxBlockHeight = 9223372036854775807,
      page = 1, perPage = 100) {
    return await this.database.findSorted(
        {$where: function() {
          return ((!this.spent) && (this.confidentialKey.length > 0) &&
              (this.blockHeight !== -1) &&
              (this.blockHeight <= maxBlockHeight));
        }}, page, perPage);
  };

  async getUtxosUnblindUnspentable(maxBlockHeight = 9223372036854775807,
      page = 1, perPage = 100) {
    return await this.database.findSorted(
        {$where: function() {
          return ((!this.spent) && (this.confidentialKey.length === 0) &&
              (this.blockHeight !== -1) &&
              (this.blockHeight <= maxBlockHeight));
        }}, page, perPage);
  };
};
