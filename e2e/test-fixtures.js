import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DEFAULT_AXE_TAGS = [
  'best-practice',
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'cat.semantics',
  'cat.forms'
];

const DEFAULT_DISABLE_RULES = [
  'page-has-heading-one'
];

const test = base.extend({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = (options = {}) => {
      const {
        tags = DEFAULT_AXE_TAGS,
        disableRules = DEFAULT_DISABLE_RULES
      } = options;

      return new AxeBuilder({ page })
        .withTags(tags)
        .disableRules(disableRules);
    };

    await use(makeAxeBuilder);
  },
});

export { test };
