const request = require('request');

module.exports = async (requestBody) => new Promise((resolve, reject) => {
  request(requestBody, (error, response, body) => {
    if (error) {
      reject(error);
    } else if (response.statusCode === 200) {
      resolve(body);
    } else {
      reject('not found!');
    }
  });
});