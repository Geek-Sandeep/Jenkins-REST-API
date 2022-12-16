const Jenkins = require("jenkins");
const { auth, host, port } = require('../constants/jenkins');

module.exports = async (req, res) => {
  const { job_name, build_id } = req.body;

  if (!build_id || !job_name) {
    return res.status(404).send('build id or job name are required!')
  }

  // new jenkins instance
  const jenkins = new Jenkins({
    baseUrl: `http://${auth.username}:${auth.password}@${host}:${port}`,
  });

  try {
    // get build logs 
    const logs = await jenkins.build.log(job_name, build_id);

    res.json(logs);
  } catch (error) {
    res.status(404).send(error.message);
  }
}