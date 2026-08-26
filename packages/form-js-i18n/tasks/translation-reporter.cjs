const fs = require('node:fs');
const path = require('node:path');

const TRANSLATIONS_FILE = path.join(__dirname, '..', 'docs', 'translations.json');

/**
 * Collects the keys logged by `TranslationCollector` into `docs/translations.json`.
 *
 * Viewer and editor run as separate karma processes, so the file is merged rather
 * than overwritten; `npm run collect-translations` removes it up front to drop keys
 * that no longer exist.
 */
function TranslationReporter() {
  const collected = [];

  this.onBrowserLog = function (browser, log) {
    if (typeof log !== 'string') {
      return;
    }

    // karma wraps browser logs in single quotes
    const message = log.startsWith("'") ? log.slice(1, -1) : log;

    let entry;

    try {
      entry = JSON.parse(message);
    } catch {
      return;
    }

    if (entry && entry.type === 'translations') {
      collected.push(entry.msg);
    }
  };

  this.onRunComplete = function () {
    const existing = fs.existsSync(TRANSLATIONS_FILE) ? JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8')) : [];

    const merged = Array.from(new Set([...existing, ...collected])).sort();

    fs.mkdirSync(path.dirname(TRANSLATIONS_FILE), { recursive: true });
    fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(merged, null, 2) + '\n');
  };
}

module.exports = {
  'reporter:translation-reporter': ['type', TranslationReporter],
};
