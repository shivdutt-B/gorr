const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios');
require("dotenv").config();

const app = express();
const PORT = 1000;  // Using port 1000 as requested
const BUCKET_BASE_URL = "http://deployments-container.s3.eu-north-1.amazonaws.com";

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Function to rewrite HTML content to fix relative paths
function rewriteHtmlPaths(html, projectName) {
  // Replace relative URLs with absolute project-prefixed URLs
  return html.replace(/(href|src)=["'](?!http|https|\/\/|\/project)([^"']+)["']/g, (match, attr, path) => {
    // Don't modify absolute URLs or already prefixed URLs
    if (path.startsWith('/project/')) {
      return match;
    }
    
    // Handle paths that start with /
    if (path.startsWith('/')) {
      return `${attr}="/project/${projectName}${path}"`;
    } 
    
    // Handle relative paths
    return `${attr}="/project/${projectName}/${path}"`;
  });
}

// Direct fetch approach
app.use('/project/:project*', async (req, res) => {
  try {
    // Extract the project name
    const projectName = req.params.project;
    console.log(`Project requested: ${projectName}`);
    
    // Get the rest of the path (if any)
    const restOfPath = req.params[0] || '';
    
    // Create target URL in S3
    const s3Path = `${projectName}${restOfPath}`;
    const s3Url = `${BUCKET_BASE_URL}/${s3Path}`;
    
    console.log(`Attempting to fetch directly from S3: ${s3Url}`);
    
    // Fetch the content from S3
    const response = await axios.get(s3Url, {
      validateStatus: function (status) {
        return status < 500; // Accept all responses to check status
      },
      responseType: 'arraybuffer' // Use arraybuffer to handle all content types
    });
    
    if (response.status === 403) {
      console.log(`Access denied to S3: ${s3Url}`);
      return res.status(404).send(`
        <h1>Project Not Found or Access Denied</h1>
        <p>Could not access: ${projectName}${restOfPath}</p>
        <p>Please check that the project name is correct and that the files exist in the S3 bucket.</p>
        <p>S3 response: ${response.status} - ${response.statusText}</p>
      `);
    }
    
    if (response.status === 404) {
      console.log(`File not found in S3: ${s3Url}`);
      
      // Try to serve index.html for SPA paths
      if (!restOfPath.match(/\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico)$/)) {
        // This might be an SPA route, try index.html
        const indexUrl = `${BUCKET_BASE_URL}/${projectName}/index.html`;
        console.log(`Trying SPA fallback: ${indexUrl}`);
        
        try {
          const indexResponse = await axios.get(indexUrl, { responseType: 'arraybuffer' });
          console.log(`SPA fallback successful`);
          
          // Set content type
          res.set('Content-Type', 'text/html');
          
          // Convert buffer to string
          const contentType = indexResponse.headers['content-type'];
          const isTextContent = contentType && (contentType.includes('text') || contentType.includes('javascript') || contentType.includes('html'));
          
          if (isTextContent) {
            // For HTML content, rewrite URLs to absolute paths
            let htmlContent = indexResponse.data.toString('utf8');
            htmlContent = rewriteHtmlPaths(htmlContent, projectName);
            return res.send(htmlContent);
          } else {
            return res.send(indexResponse.data);
          }
        } catch (error) {
          console.log(`SPA fallback failed: ${error.message}`);
        }
      }
      
      return res.status(404).send(`
        <h1>File Not Found</h1>
        <p>Could not find: ${projectName}${restOfPath}</p>
        <p>Please check that the file exists in the S3 bucket.</p>
      `);
    }
    
    // Set proper content type from response headers
    if (response.headers['content-type']) {
      res.set('Content-Type', response.headers['content-type']);
    } else {
      // Try to determine content type from extension
      const extension = restOfPath.split('.').pop().toLowerCase();
      const contentTypes = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon'
      };
      if (contentTypes[extension]) {
        res.set('Content-Type', contentTypes[extension]);
      }
    }
    
    // Check if this is HTML content that needs URL rewriting
    const contentType = response.headers['content-type'];
    const isTextContent = contentType && (contentType.includes('text') || contentType.includes('javascript') || contentType.includes('html'));
    
    if (contentType && contentType.includes('html')) {
      // For HTML content, rewrite URLs to absolute paths
      let htmlContent = response.data.toString('utf8');
      htmlContent = rewriteHtmlPaths(htmlContent, projectName);
      return res.send(htmlContent);
    }
    
    // For non-HTML content, just send the data as is
    res.send(response.data);
    
  } catch (error) {
    console.error('Error accessing S3:', error.message);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

// Redirect missing paths to project format
app.use('/:project/*', (req, res) => {
  const projectName = req.params.project;
  const restOfPath = req.params[0] || '';
  
  // Redirect to the correct format
  res.redirect(`/project/${projectName}/${restOfPath}`);
});

// Fallback for root requests - show instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>S3 Project Viewer</h1>
    <p>Please use /project/{projectName} to access your projects</p>
    <p>Example: <a href="/project/apple-clone">/project/apple-clone</a></p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${BUCKET_BASE_URL}`);
});