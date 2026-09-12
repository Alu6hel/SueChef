const { execSync } = require('child_process');

function getWsUrl() {
  const raw = execSync('curl -s http://127.0.0.1:9223/json/list').toString();
  const json = JSON.parse(raw);
  return json[0].webSocketDebuggerUrl;
}

async function evalInWebview(expr) {
  const wsUrl = getWsUrl();
  const ws = new WebSocket(wsUrl);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    };
    ws.onmessage = msg => {
      const resp = JSON.parse(msg.data);
      ws.close();
      if (resp.result && resp.result.result) {
        resolve(resp.result.result.value);
      } else {
        resolve(resp);
      }
    };
    ws.onerror = reject;
  });
}

const expr = process.argv.slice(2).join(' ') || 'document.title';
evalInWebview(expr)
  .then(val => {
    console.log(typeof val === 'object' ? JSON.stringify(val, null, 2) : val);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
