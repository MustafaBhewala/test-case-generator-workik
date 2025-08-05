module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const debug = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    env_vars_available: {
      GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
    },
    github_client_id_length: process.env.GITHUB_CLIENT_ID?.length || 0
  };
  
  res.json(debug);
};
