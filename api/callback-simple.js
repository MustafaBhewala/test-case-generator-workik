module.exports = async (req, res) => {
  // Just return a simple success message to verify GitHub can reach this endpoint
  console.log('=== SIMPLE CALLBACK TEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', req.query);
  console.log('Headers host:', req.headers.host);
  
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`
CALLBACK ENDPOINT REACHED!

Method: ${req.method}
URL: ${req.url}
Query: ${JSON.stringify(req.query, null, 2)}
Host: ${req.headers.host}
Time: ${new Date().toISOString()}

This proves GitHub can reach your callback endpoint.
  `);
};
