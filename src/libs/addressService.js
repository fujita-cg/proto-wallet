module.exports = class AddressManager {
  constructor(username = 'db', dirPath = './') {
    this.cfgTbl = new db.createDatabase(`${name}_utxo`, dirPath);
  };

  async initialize() {
    await this.database.createIndex('outpoint');
    return true;
  };

  async addUtxo(pubkey, hdkeyPath, address) {
    return await this.database.insert(
        {pubkey: pubkey, path: hdkeyPath, address: address});
  };

  // disable update

  async deleteFromPubkey(pubkey) {
    return await this.database.delete({pubkey: pubkey}, {multi: true});
  };
  async deleteFromAddress(address) {
    return await this.database.delete({address: address}, {multi: true});
  };
};

/*
HDkey
m/44'/(nettype)'/(account)'/(recv/fee)/index

nettype: ネットワーク。main:0, test:1 -> reg:2?
account: ウォレットごとのアカウント。
recv/fee: 受け取り用(0)か、おつり用(1)のアドレス鍵。
index: アドレスのIndex。

*/


