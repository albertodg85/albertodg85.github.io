const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const scriptsDir = path.join(__dirname, 'scripts');

app.use(express.static(__dirname));

app.get('/api/scripts', (req, res) => {
  fs.readdir(scriptsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Could not list scripts' });
    }
    const pyFiles = files.filter(f => f.endsWith('.py'));
    res.json(pyFiles);
  });
});

app.post('/api/run/:name', (req, res) => {
  const scriptPath = path.join(scriptsDir, req.params.name);
  if (!scriptPath.startsWith(scriptsDir) || !scriptPath.endsWith('.py')) {
    return res.status(400).json({ error: 'Invalid script' });
  }
  execFile('python3', [scriptPath], { timeout: 10000 }, (err, stdout, stderr) => {
    res.json({ stdout, stderr: stderr || (err && err.message) });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
