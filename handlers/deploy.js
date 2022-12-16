const https = require('https');
const Jenkins = require("jenkins");
const getBuildLogs = require('../helpers/get-build-logs');
const logs_callback = require('../helpers/logs-callback');
const { auth, host, port } = require('../constants/jenkins');

module.exports = async (req, res) => {
  const { bundle, env, job_name, cb_url } = req.body;

  // Solved: AxiosError: unable to verify the first certificate
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // parameters
  const bundle_hash = bundle;
  const env_hash = env;

  // new jenkins instance
  const jenkins = new Jenkins({
    baseUrl: `http://${auth.username}:${auth.password}@${host}:${port}`,
  });

  // build a job
  await jenkins.job.build({
    name: job_name,
    parameters: { "env": env_hash, "bundle": bundle_hash },
  });

  // get job info
  const info = await jenkins.job.get(job_name);

  // create new request to get build logs
  const buildRequest = {
    url: `http://${host}:${port}/job/${job_name}/${info.nextBuildNumber}/logText/progressiveText?start=0`,
    auth, httpsAgent
  };

  try {
    // get build logs
    const response = await getBuildLogs(buildRequest)

    // request for callback logs
    const cbRequest = {
      url: cb_url,
      headers: { "Content-Type": 'text/plain' },
      body: response
    }

    // callback logs
    await logs_callback(cbRequest);

    res.send("Successfully logs sent!")
  } catch (error) {
    res.status(404).send(error.message);
  }
}