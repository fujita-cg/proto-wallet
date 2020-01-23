module.exports = class UtxoService {
  constructor(databaseService, addressService, client) {
    this.databaseService = databaseService;
    this.addressService = addressService;
    this.rpc = client;
    this.utxoTable = databaseService.getUtxoTable();
  };

  async initialize() {
    return true;
  };

  async generate(address) {
    //
  };

  async changeState(blockMap = {}) {
    // receive block from walletManager
    // update utxo state
    // blockMap:
  }

  async addUtxo(tx, index, descriptor) {
    // FIXME not implement
    // parse tx
    // collect info by vout[index]
    // save utxoTable
  };

  async updateUtxo(outpoint, blockHash, blockCount) {
    // update utxoTable
  };

  async updateUtxoState(outpoint, spent = true) {
    //
    // update utxoTable spent
  };

  async updateUtxoConfirmation(outpoint, confirmation) {
    // update utxoTable
  };

  async deleteUtxo(outpoint) {
    // delete utxoTable
  };

  async deleteUtxoSpentAndConfirmation(confirmation = 6) {
    // delete utxoTable spent=true, confirm >= 6
  };

  async getTotalAmount(address = '', asset = '') {
  };

  async getTotalAmountByConfirmation(confirmation = 6) {
  };

  async listUnspent() {
  }
};
