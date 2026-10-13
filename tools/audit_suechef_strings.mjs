import http from 'http';

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9225/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        resolve(list[0].webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  // Set language to Spanish
  await evaluate(`(() => {
    const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Language:'));
    if (langBtn) langBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 200));
  await evaluate(`(() => {
    const esBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Español'));
    if (esBtn) esBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 400));

  const texts = await evaluate(`(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const results = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (!parent || parent.offsetParent === null) continue; // skip hidden
      const t = walker.currentNode.textContent.trim();
      if (t.length > 2 && !/^[0-9\\s%$.,:;+=\\/-]+$/.test(t)) {
        results.push(t);
      }
    }
    return Array.from(new Set(results));
  })()`);

  console.log(`Found ${texts.length} visible text strings on current screen:`);
  texts.forEach(t => console.log(' - ', t));

  ws.close();
}

run().catch(console.error);
