const Datastore = require('nedb-promises');

// https://hajipy.net/2018/08/nedb-basic/
exports.createDatabase = function(name = 'db', dirPath = './') {
  const dbName = name;
  const datastore = Datastore.create(`${dirPath}/${name}.db`);

  this.createIndex = async function(keyName, unique = true) {
    // regenerate file
    return await datastore.ensureIndex({fieldName: keyName, unique: unique});
  };

  this.insert = async function(data, query = {}) {
    if (Object.keys(query).length > 0) {
      const num = await datastore.count(query);
      if (num > 0) {
        return false;
      }
    }
    return await datastore.insert(data);
  };

  this.update = async function(query, data, options = {}) {
    return await datastore.update(query, data, options);
  };

  this.delete = async function(query = {}, options = {}) {
    return await datastore.remove(query, options);
  };

  this.find = async function(query = {}, projection) {
    return await datastore.find(query, projection);
  };

  this.findOne = async function(query = {}, projection = {}, sortQuery = {}) {
    return await datastore.findOne(query, projection).sort(sortQuery);
  };

  this.findSorted = async function(query = {}, page = 1, perPage = 10,
      projection = {}, sortQuery = {}, secondQuery = {}) {
    if (page <= 1) {
      if (Object.keys(secondQuery).length > 0) {
        return await datastore.find(query, projection).find(secondQuery)
            .sort(sortQuery).limit(perPage);
      } else {
        return await datastore.find(query, projection).sort(sortQuery)
            .limit(perPage);
      }
    } else {
      const skipNum = (page - 1) * perPage;
      if (Object.keys(secondQuery).length > 0) {
        return await datastore.find(query, projection).find(secondQuery)
            .limit(perPage).skip(skipNum);
      } else {
        return await datastore.find(query, projection)
            .limit(perPage).skip(skipNum);
      }
    }
  };

  this.count = async function(query = {}) {
    return await datastore.count(query);
  };

  this.getDbName = function() {
    return dbName;
  };
};
