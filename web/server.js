const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 80;
const COMPOSE_FILE = '/workspace/docker-compose.yml';

function run(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`[EXEC] ${cmd}`);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`[ERROR] ${stderr}`);
        reject(stderr || err.message);
      } else {
        console.log(`[OUTPUT] ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// === API START ===
app.post('/api/start', async (req, res) => {
  try {
    await run(`docker compose -f ${COMPOSE_FILE} up -d se-server`);
    res.json({ status: 'started' });
  } catch (e) {
    console.error('[START ERROR]', e);
    res.status(500).json({ error: e.toString() });
  }
});

// === API STOP ===
app.post('/api/stop', async (req, res) => {
  try {
    await run(`docker compose -f ${COMPOSE_FILE} stop se-server`);
    res.json({ status: 'stopped' });
  } catch (e) {
    console.error('[STOP ERROR]', e);
    res.status(500).json({ error: e.toString() });
  }
});

// === API STATUS ===
app.get('/api/status', (req, res) => {
  const cmd = `docker compose -f ${COMPOSE_FILE} ps --services --filter "status=running"`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('[STATUS ERROR]', stderr);
      return res.status(500).json({ error: stderr || err.message });
    }
    const running = stdout.includes('se-server');
    res.json({ running });
  });
});

// === FRONTEND STATIC ===
app.use(express.static(path.join(__dirname, 'public')));

// === START SERVER ===
app.listen(PORT, () => console.log(`[WEB] Interface listening on port ${PORT}`));
