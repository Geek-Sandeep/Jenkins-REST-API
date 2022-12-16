var fs = require('fs');
var axios = require('axios');
var FormData = require('form-data');
const https = require('https');

module.exports = async (req, res) => {
  // const { _username, _password, _envFilePath, _zipFilePath, _jenkinsUrl } = req.body;

  const jenkinsUrl = 'https://jenkins.blr.geekydev.com/job/test/build';
  const userName = 'admin';
  const password = '11b7b6036e4b190744f5261dfc321f2143'

  const bundle_hash = 'ieoty2d8934y82x';
  const env_hash = 'ieoty2d8934yfskhet82x';

  const params = {
    "parameter": [
      { "name": "env", "value": env_hash },
      { "name": "bundle", "value": bundle_hash }
    ]
  }

  // initialize form data
  const data = new FormData();
  data.append('json', JSON.stringify(params));

  // Solved: AxiosError: unable to verify the first certificate
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const config = {
    method: 'post',
    httpsAgent,
    url: jenkinsUrl,
    headers: {
      Authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`,
      ...data.getHeaders()
    },
    data: data
  };

  await axios(config)
    // .then((response) => response.json())
    .then((response) => {
      if (response.data === "") {
        return res.send("Deploy success!")
      }

      console.log(response.data);
      res.send("went wrong!")
    })
}