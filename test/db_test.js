const database = require('../src/libs/db/db');
const ConfigTable = require('../src/libs/db/configTable');
const AddressTable = require('../src/libs/db/addressTable');
const UtxoTable = require('../src/libs/db/utxoTable');

const main = async () => {
  let ret;
  const db1 = new database.createDatabase('test1', './data');
  const db2 = new database.createDatabase('test2', './data');
  await db1.insert({'key': 'test1', 'test_value': 'dummy1'}, {'key': 'test1'});
  await db1.insert({'key': 'test1-1', 'test_value': 'dummy1'}, {'key': 'test1-1'});
  await db1.insert({'key': 'test1-2', 'test_value': 'dummy2'}, {'key': 'test1-2'});
  await db1.insert({'key': 'test1-3', 'test_value': 'dummy1'}, {'key': 'test1-3'});
  await db2.insert({'key': 'test2', 'test_value': 'dummy2'}, {'key': 'test2'});
  const insret1 = await db2.insert({'key': 'test2-1', 'test_value': 'dummy2'});
  const insret2 = await db2.insert({'key': 'test2-2', 'test_value': 'dummy2'}, {'key': 'test2-2'});
  console.log('insert1 = ', insret1);
  console.log('insert2 = ', insret2);

  const datas = await db1.findSorted(query = {'test_value': 'dummy1'}, page = 1);
  console.log('dump data1 = ', datas);

  const delret = await db2.delete({'key': 'test2-1'});
  console.log('delete = ', delret);
  const upret1 = await db2.update({'key': 'test2-2'}, {'key': 'test2-2', 'test_value': 'dummy3'});
  console.log('update = ', upret1);
  const datas2 = await db2.findSorted(query = {'test_value': 'dummy2'}, page = 1);
  console.log('dump data2 = ', datas2);
  const upret2 = await db2.update({'key': 'test2-2'}, {'key': 'test2-2', 'test_value': 'dummy2'});
  console.log('update = ', upret2);
  const datas22 = await db2.findSorted(query = {'test_value': 'dummy2'}, page = 1);
  console.log('dump data2-2 = ', datas22);

  const datas3 = await db2.findSorted(query = {'test_value': 'dummyx'}, page = 1);
  console.log('dump data3 = ', datas3);

  const datasUnSort = await db1.find(query = {'test_value': 'dummy1'});
  console.log('dump data1 UnSort = ', datasUnSort);

  const datasOne = await db1.findOne(query = {'test_value': 'dummy1'});
  console.log('dump data1 One = ', datasOne);

  const dir = './data';
  const walletName = 'user1';

  // configTable
  const confTbl = new ConfigTable(walletName, dir);
  const cfdInitRet = await confTbl.initialize('regtest');
  console.log('confTbl init = ', cfdInitRet);
  const cfdGetRet = await confTbl.getNetworkType();
  console.log('confTbl getNW = ', cfdGetRet);
  let bip32Cnt = await confTbl.getBip32Count();
  console.log('confTbl bip32Cnt = ', bip32Cnt);
  let blindCnt = await confTbl.getBlindingKeyCount();
  console.log('confTbl blindCnt = ', blindCnt);

  let updateRet = await confTbl.updateBip32Count(50);
  console.log('update bip32Cnt = ', updateRet);
  updateRet = await confTbl.updateBlindingKeyCount(100);
  console.log('update blindCnt = ', updateRet);

  bip32Cnt = await confTbl.getBip32Count();
  console.log('confTbl bip32Cnt = ', bip32Cnt);
  blindCnt = await confTbl.getBlindingKeyCount();
  console.log('confTbl blindCnt = ', blindCnt);
  await confTbl.updateBip32Count(0);
  await confTbl.updateBlindingKeyCount(0);

  // AddressTable
  const addrTbl = new AddressTable(walletName, dir);
  const pubkey1 = '031d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1';
  await addrTbl.addPubkeyAddress(
      pubkey = pubkey1, hdkeyPath = '44\'/0\'/0\'/2',
      address = 'bcrt1q7jm5vw5cunpy3lkvwdl3sr3qfm794xd46h0u0k',
      addressType = 'p2wpkh', lockingScript = '0014f4b7463a98e4c248fecc737f180e204efc5a99b5');
  await addrTbl.addPubkeyAddress(
      pubkey = pubkey1, hdkeyPath = '44\'/0\'/0\'/2',
      address = '2MsmYwi6mZfo9Qk2Yz6HwXTD5u2LnsBn7qQ',
      addressType = 'p2sh-p2wpkh', lockingScript = 'a91405bc4d5d12925f008cef06ba387ade16a49d7a3187');
  await addrTbl.addPubkeyAddress(
      pubkey = pubkey1, hdkeyPath = '44\'/0\'/0\'/2',
      address = 'n3ptiz3wRp5kZswtNMpGDbJJoJLKz8WfoS',
      addressType = 'p2pkh', lockingScript = '76a914f4b7463a98e4c248fecc737f180e204efc5a99b588ac');
  const addrRet11 = await addrTbl.getAddress('bcrt1q7jm5vw5cunpy3lkvwdl3sr3qfm794xd46h0u0k');
  const addrRet12 = await addrTbl.getAddress('2MsmYwi6mZfo9Qk2Yz6HwXTD5u2LnsBn7qQ');
  const addrRet21 = await addrTbl.getPubkeyAddress(pubkey1, 'p2wpkh');
  const addrRet22 = await addrTbl.getPubkeyAddress(pubkey1, 'p2sh-p2wpkh');
  const addrRet31 = await addrTbl.getPubkeyAddresses(pubkey1);
  console.log('addrTbl pubkey1 getAddress1 = ', addrRet11);
  console.log('addrTbl pubkey1 getAddress2 = ', addrRet12);
  console.log('addrTbl pubkey1 getPubkeyAddress1  = ', addrRet21);
  console.log('addrTbl pubkey1 getPubkeyAddress2  = ', addrRet22);
  console.log('addrTbl pubkey1 getPubkeyAddresses = ', addrRet31);

  ret = await addrTbl.deleteByAddress('n3ptiz3wRp5kZswtNMpGDbJJoJLKz8WfoS');
  console.log('addrTbl pubkey1 deleteByAddress = ', ret);
  const addrRet32 = await addrTbl.getPubkeyAddresses(pubkey1);
  console.log('addrTbl pubkey1 getPubkeyAddresses = ', addrRet32);

  ret = await addrTbl.deleteByPubkey(pubkey1);
  console.log('addrTbl pubkey1 deleteByPubkey = ', ret);
  const addrRet33 = await addrTbl.getPubkeyAddresses(pubkey1);
  console.log('addrTbl pubkey1 getPubkeyAddresses = ', addrRet33);

  const multisigScript = '52210205ffcdde75f262d66ada3dd877c7471f8f8ee9ee24d917c3e18d01cee458bafe2102be61f4350b4ae7544f99649a917f48ba16cf48c983ac1599774958d88ad17ec552ae';
  await addrTbl.addScriptAddress(
      script = multisigScript,
      address = 'bcrt1q7w0kyu46ddterr4sglzac38mgaf4dv8jfsf0egumry5yaqqq3fpqg5dgjn',
      addressType = 'p2wsh',
      lockingScript = '0020f39f6272ba6b57918eb047c5dc44fb475356b0f24c12fca39b19284e80008a42',
      isMultisig = true, pubkeyMap = {'': ['0205ffcdde75f262d66ada3dd877c7471f8f8ee9ee24d917c3e18d01cee458bafe', '02be61f4350b4ae7544f99649a917f48ba16cf48c983ac1599774958d88ad17ec5']});
  const addrRet41 = await addrTbl.getAddress('bcrt1q7w0kyu46ddterr4sglzac38mgaf4dv8jfsf0egumry5yaqqq3fpqg5dgjn');
  const addrRet42 = await addrTbl.getScriptAddress(multisigScript, 'p2wsh');
  const addrRet43 = await addrTbl.getScriptAddresses(multisigScript);
  console.log('addrTbl script getAddress         = ', addrRet41);
  console.log('addrTbl script getScriptAddress   = ', addrRet42);
  console.log('addrTbl script getScriptAddresses = ', JSON.stringify(addrRet43, null, ' '));

  ret = await addrTbl.deleteByScript(multisigScript);
  console.log('addrTbl script deleteByScript = ', ret);
  const addrRet44 = await addrTbl.getScriptAddresses(multisigScript);
  console.log('addrTbl script getScriptAddresses = ', JSON.stringify(addrRet44, null, ' '));

  // UtxoTable
  const utxoTbl = new UtxoTable(walletName, dir);
  // utxoTbl.initialize();
  await utxoTbl.addUtxo(
      txid = '2d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1',
      vout = 0, amount = 10000,
      address = 'bcrt1q7jm5vw5cunpy3lkvwdl3sr3qfm794xd46h0u0k',
      descriptor = 'wpkh(031d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1)',
      lockingScript = '0014f4b7463a98e4c248fecc737f180e204efc5a99b5');
  await utxoTbl.addUtxo(
      txid = '3d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1',
      vout = 0, amount = 12000,
      address = 'bcrt1q7jm5vw5cunpy3lkvwdl3sr3qfm794xd46h0u0k',
      descriptor = 'wpkh(031d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1)',
      lockingScript = '0014f4b7463a98e4c248fecc737f180e204efc5a99b5');
  await utxoTbl.addUtxo(
      txid = '4d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1',
      vout = 1, amount = 20000,
      address = '2MsmYwi6mZfo9Qk2Yz6HwXTD5u2LnsBn7qQ',
      descriptor = 'sh(wpkh(031d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1))',
      lockingScript = 'a91405bc4d5d12925f008cef06ba387ade16a49d7a3187');
  const utxoRet1 = await utxoTbl.getUtxoCount();
  const utxoRet2 = await utxoTbl.getUtxoByOutpoint('3d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1,0');
  console.log('utxoTbl getUtxoCount          = ', utxoRet1);
  console.log('utxoTbl getUtxoByOutpoint     = ', utxoRet2);
  const utxoRet3 = await utxoTbl.getUtxosByAddress('bcrt1q7jm5vw5cunpy3lkvwdl3sr3qfm794xd46h0u0k');
  console.log('utxoTbl getUtxosByAddress     = ', utxoRet3);
  const utxoRet4 = await utxoTbl.getUtxosUnspentable();
  console.log('utxoTbl getUtxosUnspentable   = ', utxoRet4);

  const utxoRet5 = await utxoTbl.updateSpentable('3d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1,0', true);
  const utxoRet6 = await utxoTbl.getUtxosUnspentable();
  const utxoRet7 = await utxoTbl.getUtxos();
  console.log('utxoTbl updateSpentable       = ', utxoRet5);
  console.log('utxoTbl getUtxosUnspentable2  = ', utxoRet6);
  console.log('utxoTbl getUtxos              = ', utxoRet7);

  const utxoRet8 = await utxoTbl.deleteByOutpoint('4d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1,1');
  const utxoRet9 = await utxoTbl.getUtxos();
  console.log('utxoTbl deleteByOutpoint      = ', utxoRet8);
  console.log('utxoTbl getUtxos              = ', utxoRet9);
  await utxoTbl.deleteByOutpoint('3d7463018f867de51a27db866f869ceaf52abab71827a6051bab8a0fd020f4c1,0');
};
main();
