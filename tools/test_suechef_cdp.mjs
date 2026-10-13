import http from 'http';

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9225/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        if (list.length > 0 && list[0].webSocketDebuggerUrl) {
          resolve(list[0].webSocketDebuggerUrl);
        } else {
          reject(new Error('No target page found'));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to SueChef WebSocket:', wsUrl);

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
  console.log('Connected to SueChef CDP!');

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

  // 1. Initial State
  const initial = await evaluate(`({
    lang: localStorage.getItem('suechef_language') || 'en',
    currentScaleTitle: document.querySelector('.font-serif.font-bold')?.textContent?.trim()
  })`);
  console.log('Initial SueChef State:', initial);

  // 2. Test switching to Spanish ('es')
  console.log('\n--- Switching to Spanish (es) ---');
  // Find the language button in header and click it, or find dropdown
  await evaluate(`
    // Click language button in Header to open dropdown
    const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Language:'));
    if (langBtn) {
      langBtn.click();
    }
  `);

  await new Promise(r => setTimeout(r, 300));

  // Find Spanish button in the opened dropdown and click it
  const clickRes = await evaluate(`
    const esBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Español'));
    if (esBtn) {
      esBtn.click();
      ({ success: true, text: esBtn.textContent.trim() });
    } else {
      ({ success: false, buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(Boolean).slice(0, 20) });
    }
  `);
  console.log('Spanish click result:', clickRes);

  await new Promise(r => setTimeout(r, 500));

  // Verify texts in Spanish
  const esCheck = await evaluate(`({
    lang: localStorage.getItem('suechef_language'),
    scaleTitle: document.querySelector('.font-serif.font-bold')?.textContent?.trim(),
    homeTab: document.querySelector('button.stepper-tab, button[data-tab="home"]')?.textContent?.trim() || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Home') || b.textContent.includes('Inicio'))?.textContent?.trim(),
    bottomNavHome: Array.from(document.querySelectorAll('.bottom-nav-item, nav button')).map(b => b.textContent.trim()).slice(0, 6)
  })`);
  console.log('Spanish Check:', esCheck);

  // Switch to German ('de')
  console.log('\n--- Switching to German (de) ---');
  await evaluate(`
    const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Language:'));
    if (langBtn) langBtn.click();
  `);
  await new Promise(r => setTimeout(r, 300));
  await evaluate(`
    const deBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Deutsch'));
    if (deBtn) deBtn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  const deCheck = await evaluate(`({
    lang: localStorage.getItem('suechef_language'),
    scaleTitle: document.querySelector('.font-serif.font-bold')?.textContent?.trim()
  })`);
  console.log('German Check:', deCheck);

  // Switch to French ('fr')
  console.log('\n--- Switching to French (fr) ---');
  await evaluate(`
    const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Language:'));
    if (langBtn) langBtn.click();
  `);
  await new Promise(r => setTimeout(r, 300));
  await evaluate(`
    const frBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Français'));
    if (frBtn) frBtn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  const frCheck = await evaluate(`({
    lang: localStorage.getItem('suechef_language'),
    scaleTitle: document.querySelector('.font-serif.font-bold')?.textContent?.trim()
  })`);
  console.log('French Check:', frCheck);

  // Switch back to English
  console.log('\n--- Switching back to English (en) ---');
  await evaluate(`
    const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Language:'));
    if (langBtn) langBtn.click();
  `);
  await new Promise(r => setTimeout(r, 300));
  await evaluate(`
    const enBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('English'));
    if (enBtn) enBtn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  console.log('SueChef language test completed!');
  ws.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
