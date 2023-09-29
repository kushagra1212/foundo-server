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
