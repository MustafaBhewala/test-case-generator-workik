module.exports = async (req, res) => {
  // Log absolutely everything
  console.log('=== CALLBACK TEST DEBUG ===');
  console.log('Full request details:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  
  // Return a simple HTML page instead of redirecting
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head><title>Callback Debug</title></head>
      <body>
        <h1>Callback Debug Information</h1>
        <h2>URL:</h2>
        <pre>${req.url || 'No URL'}</pre>
        
        <h2>Query Parameters:</h2>
        <pre>${JSON.stringify(req.query, null, 2)}</pre>
        
        <h2>Headers:</h2>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
        
        <h2>Method:</h2>
        <pre>${req.method}</pre>
        
        <p><a href="https://workik-task.vercel.app">Back to App</a></p>
        
        <script>
          console.log('Full URL:', window.location.href);
          console.log('Search params:', window.location.search);
        </script>
      </body>
    </html>
  `);
};
