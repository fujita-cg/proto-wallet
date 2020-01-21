const database = require('../src/libs/db/db')

const main = async () => {
  let db1 = new database.createDatabase('test1', './data');
  let db2 = new database.createDatabase('test2', './data');
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
  const datas2 = await db2.findSorted(query = {'test_value': 'dummy2'}, page = 1);
  console.log('dump data2 = ', datas2);

  const datas3 = await db2.findSorted(query = {'test_value': 'dummyx'}, page = 1);
  console.log('dump data3 = ', datas3);

  const datasUnSort = await db1.find(query = {'test_value': 'dummy1'});
  console.log('dump data1 UnSort = ', datasUnSort);

  const datasOne = await db1.findOne(query = {'test_value': 'dummy1'});
  console.log('dump data1 One = ', datasOne);
};
main();
