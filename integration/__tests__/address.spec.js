const TestHelper = require('../helper/test_helper')
const cfdjs = require('cfd-js')

describe('CreateBitcoinAddress', () => {
  const helper = new TestHelper()
  const bitcoinCli = helper.getBitcoinCli()

  it('BitcoinAddress', () => {
    const keyPair = cfdjs.CreateKeyPair({
      "wif": true,
      "network": "regtest",
      "isCompressed": true
    })
    const { address } = cfdjs.CreateAddress({
      "keyData": {
        "hex": keyPair.pubkey,
        "type": "pubkey",
      },
      "network": "regtest",
      "hashType": "p2wpkh",
    })

    console.log(bitcoinCli.getaddressinfo(address))

    expect(bitcoinCli.getaddressinfo(address)).resolves.toBe("{}")
  })
})
