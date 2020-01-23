const ConfigTable = require('./db/configTable');
const AddressTable = require('./db/addressTable');
const ConfidentialKeyTable = require('./db/confidentialKeyTable');
const UtxoTable = require('./db/utxoTable');

module.exports = class DatabaseAccessor {
  constructor(name = 'db', dirPath = './') {
    this.cfgTbl = new ConfigTable(name, dirPath);
    this.addrTbl = new AddressTable(name, dirPath);
    this.cfdKeyTbl = new ConfidentialKeyTable(name, dirPath);
    this.utxoTbl = new UtxoTable(name, dirPath);
  };

  async initialize(network) {
    await this.addrTbl.initialize();
    await this.cfdKeyTbl.initialize();
    await this.utxoTbl.initialize();
    return await this.cfgTbl.initialize(network);
  };

  getConfigTable() {
    return this.cfgTbl;
  };

  getAddressTable() {
    return this.addrTbl;
  };

  getConfidentialKeyTable() {
    return this.cfdKeyTbl;
  };

  getUtxoTable() {
    return this.utxoTbl;
  };
};
