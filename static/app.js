(() => {
  const sourceSelect = document.getElementById('sourceLang');
  const targetSelect = document.getElementById('targetLang');
  const inputText = document.getElementById('inputText');
  const translateBtn = document.getElementById('translateBtn');
  const outputText = document.getElementById('outputText');
  const copyBtn = document.getElementById('copyBtn');
  const message = document.getElementById('message');

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  function populateSelect(select, includeAuto) {
    select.innerHTML = '';
    languages
      .filter(l => includeAuto ? true : l.code !== 'auto')
      .forEach(({ code, name }) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${name} (${code})`;
        select.appendChild(opt);
      });
  }

  function setDefaults() {
    sourceSelect.value = 'auto';
    targetSelect.value = 'en';
  }

  function setMessage(text, type = 'info') {
    message.textContent = text || '';
    message.className = `message ${type}`;
  }

  async function handleTranslate() {
    const text = (inputText.value || '').trim();
    if (!text) {
      setMessage('Please enter text to translate.', 'warn');
      inputText.focus();
      return;
    }

    const source = sourceSelect.value || 'auto';
    const target = targetSelect.value;
    if (!target) {
      setMessage('Please select a target language.', 'warn');
      return;
    }

    translateBtn.disabled = true;
    translateBtn.textContent = 'Translating…';
    setMessage('Translating…', 'info');

    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source, target })
      });

      if (!resp.ok) {
        let errText = 'Translation failed.';
        try {
          const err = await resp.json();
          errText = (err && (err.detail || err.error || JSON.stringify(err))) || errText;
        } catch (_) {}
        throw new Error(typeof errText === 'string' ? errText : JSON.stringify(errText));
      }

      const data = await resp.json();
      outputText.textContent = data.translatedText || '';
      setMessage('Done.', 'success');
    } catch (e) {
      outputText.textContent = '';
      setMessage(String(e && e.message ? e.message : e), 'error');
    } finally {
      translateBtn.disabled = false;
      translateBtn.textContent = 'Translate';
    }
  }

  async function handleCopy() {
    const text = outputText.textContent || '';
    if (!text) {
      setMessage('Nothing to copy.', 'warn');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setMessage('Copied to clipboard.', 'success');
      setTimeout(() => { copyBtn.textContent = old; }, 1200);
    } catch (e) {
      setMessage('Copy failed.', 'error');
    }
  }

  populateSelect(sourceSelect, true);
  populateSelect(targetSelect, false);
  setDefaults();

  translateBtn.addEventListener('click', handleTranslate);
  copyBtn.addEventListener('click', handleCopy);
})();


