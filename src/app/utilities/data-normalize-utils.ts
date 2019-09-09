//renames an object keys to proper names and returns new one
//newKeys contains object with with name of new keys as value .
//data is the object to be changed
export const renameKeys = (newKeys: Object, data: Object) =>
  Object.keys(data).reduce(
    (acc, key) => ({
      ...acc,
      [newKeys[key] || key]: data[key]
    }),
    {}
  );
//reasign some values within object and returns new one
//newData = new object with key/value pairs
//oldData = object with all data
export const formatData = (newData: Object, oldData: Object) =>
  Object.keys(oldData).reduce(
    (acc, key) => ({
      ...acc,
      [key]: newData[key] || oldData[key]
    }),
    {}
  );
