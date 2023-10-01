export const getSETQuery = (body: any) => {
  let sqlUpdateString = '';
  const keys = Object.keys(body);
  const n = keys.length;
  for (let i = 0; i < n; i++) {
    sqlUpdateString += keys[i] + '=?';

    if (i != n - 1) {
      sqlUpdateString += ',';
    }
  }
  return sqlUpdateString;
};

export const getInsertQuery = (tableName: string, entry: any) => {
  let insertString = tableName;
  insertString += '(';
  let valueString = 'VALUES(';
  const keys = Object.keys(entry);
  const n = keys.length;
  for (let i = 0; i < n; i++) {
    insertString += keys[i];
    valueString += '?';
    if (i != n - 1) {
      insertString += ',';
      valueString += ',';
    }
  }
  insertString += ') ';
  valueString += ')';

  return insertString + valueString;
};
