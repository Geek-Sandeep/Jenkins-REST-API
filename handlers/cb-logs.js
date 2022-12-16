module.exports = async (req, res) => {
  console.log("Response from callback logs >\n", req.body);
  res.send();
}