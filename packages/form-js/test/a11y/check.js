const fs = require('fs');

const aChecker = require('accessibility-checker');

// todo(pinussilvestrus): how to automate that? better would be to have it in karma
const contents = fs.readFileSync(__dirname + '/form.html');

const denylist = new Set([
  'WCAG20_Html_HasLang',
  'WCAG20_Doc_HasTitle',
  'WCAG20_Body_FirstASkips_Native_Host_Sematics',
  'RPT_Html_SkipNav',
  'Rpt_Aria_OrphanedContent_Native_Host_Sematics',
]);

configureRules().then(() => {
  aChecker.getCompliance(contents.toString(), 'form-js').then(async (results) => {

    const report = results.report;

    console.log(report);

    console.log('# violations:', report.summary.counts.violation);
    console.log('# checked rules:', report.numExecuted);

    aChecker.close();
  });
});

// copied over from: https://github.com/carbon-design-system/carbon/blob/ef46ea99fbfbe77860e520d17001d7cd9199a3b6/config/jest-config-carbon/matchers/toHaveNoACViolations.js#L12
// todo(pinussilvestrus): it does not work though
async function configureRules() {
  const ruleset = await aChecker.getRuleset('IBM_Accessibility');

  const customRuleset = JSON.parse(JSON.stringify(ruleset));

  customRuleset.id = 'Custom_Ruleset';
  customRuleset.checkpoints = customRuleset.checkpoints.map((checkpoint) => {
    checkpoint.rules = checkpoint.rules.filter((rule) => {
      return !denylist.has(rule.id);
    });

    return checkpoint;
  });

  return aChecker.addRuleset(customRuleset);
}