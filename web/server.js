const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 80;
const COMPOSE_FILE = '/workspace/docker-compose.yml';

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}

app.post('/api/start', async (req, res) => {
  try {
    await run(`docker compose -f ${COMPOSE_FILE} up -d se-server`);
    res.json({status: 'started'});
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

app.post('/api/stop', async (req, res) => {
  try {
    await run(`docker compose -f ${COMPOSE_FILE} stop se-server`);
    res.json({status: 'stopped'});
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

app.get('/api/status', (req, res) => {
  exec('docker ps --filter "name=space-engineers-dedicated-docker-linux" --format "{{.Names}}"', (err, stdout) => {
    const running = stdout.trim() !== '';
    res.json({running});
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Web interface listening on port', PORT));
