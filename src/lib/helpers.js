import fs from 'fs';
import Promise from 'bluebird';

let stat = Promise.promisify(fs.stat);

let exists = function (...paths) {
  return new Promise(function(resolve) {
    let fileStats = paths.map((path) => stat(path));
    Promise.all(fileStats).then(() => resolve(true)).catch(() => resolve(false));
  });
};

export default { exists };