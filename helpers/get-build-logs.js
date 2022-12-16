const request = require('request');

module.exports = async (requestBody) => new Promise((resolve, reject) => {
  function tryAgain() {
    request(requestBody, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        if (body.search("Finished: ") < 0) {
          setTimeout(() => {
            console.log("building...")
            tryAgain();
          }, 1000);
        } else {
          resolve(body);
        }
      } else {
        setTimeout(() => {
          console.log("building...")
          tryAgain();
        }, 1000);
      }
    });
  }

  setTimeout(() => {
    console.log("building...")
    tryAgain();
  }, 1000);
});