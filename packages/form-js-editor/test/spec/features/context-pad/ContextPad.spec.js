import { bootstrapFormEditor, getFormEditor, inject } from 'test/TestHelper';

import { ContextPadModule } from 'src/features/context-pad';
import { ModelingModule } from 'src/features/modeling';
import { SelectionModule } from 'src/features/selection';

import schema from '../../form.json';

describe('features/context-pad', function () {
  beforeEach(
    bootstrapFormEditor(schema, {
      modules: [ContextPadModule, ModelingModule, SelectionModule],
    }),
  );

  afterEach(function () {
    getFormEditor().destroy();
  });

  describe('FormFieldContextActions', function () {
    it('should be available', inject(function (formFieldContextActions) {
      expect(formFieldContextActions).to.exist;
    }));

    it('should register a provider', inject(function (formFieldContextActions) {
      // given
      const provider = {
        getContextPadEntries: function () {
          return { foo: { action: () => {}, title: 'Foo' } };
        },
      };

      // when
      formFieldContextActions.registerProvider(provider);

      // then
      const entries = formFieldContextActions.getEntries({ type: 'textfield' });

      expect(entries.foo).to.exist;
    }));

    it('should register a provider with priority', inject(function (formFieldContextActions) {
      // given - higher priority fires first, lower priority fires later (has last say)
      const highPriorityProvider = {
        getContextPadEntries: function () {
          return { foo: { action: () => {}, title: 'High' } };
        },
      };

      const lowPriorityProvider = {
        getContextPadEntries: function () {
          return { foo: { action: () => {}, title: 'Low' } };
        },
      };

      // when - register low priority (fires last) after high priority (fires first)
      formFieldContextActions.registerProvider(1500, highPriorityProvider);
      formFieldContextActions.registerProvider(500, lowPriorityProvider);

      // then - low priority provider fires last, so its entry wins
      const entries = formFieldContextActions.getEntries({ type: 'textfield' });

      expect(entries.foo).to.exist;
      expect(entries.foo.title).to.equal('Low');
    }));

    it('should support updater function from provider', inject(function (formFieldContextActions) {
      // given
      const plainProvider = {
        getContextPadEntries: function () {
          return { entryA: { action: () => {}, title: 'A' } };
        },
      };

      const updatingProvider = {
        getContextPadEntries: function () {
          return function (entries) {
            return { ...entries, entryB: { action: () => {}, title: 'B' } };
          };
        },
      };

      formFieldContextActions.registerProvider(plainProvider);
      formFieldContextActions.registerProvider(updatingProvider);

      // when
      const entries = formFieldContextActions.getEntries({ type: 'textfield' });

      // then
      expect(entries.entryA).to.exist;
      expect(entries.entryB).to.exist;
    }));

    it('should return empty entries for unknown providers', inject(function (formFieldContextActions) {
      // given - only default providers registered via module

      // when
      const entries = formFieldContextActions.getEntries({ type: 'default' });

      // then - default type has no delete or morph entries
      expect(entries.delete).not.to.exist;
    }));
  });

  describe('DeleteActionProvider', function () {
    it('should provide delete entry for form fields', inject(function (formFieldContextActions, formFieldRegistry) {
      // given
      const textfield = formFieldRegistry.get('Textfield_1');

      // when
      const entries = formFieldContextActions.getEntries(textfield);

      // then
      expect(entries.delete).to.exist;
      expect(entries.delete.title).to.match(/Remove/);
      expect(entries.delete.action).to.be.a('function');
    }));

    it('should NOT provide delete entry for default form field', inject(function (
      formFieldContextActions,
      formFieldRegistry,
    ) {
      // given
      const root = formFieldRegistry.get('Form_1');

      // when
      const entries = formFieldContextActions.getEntries(root);

      // then
      expect(entries.delete).not.to.exist;
    }));

    it('should remove field on action', inject(function (
      formFieldContextActions,
      formFieldRegistry,
    ) {
      // given
      const textfield = formFieldRegistry.get('Textfield_1');
      const entries = formFieldContextActions.getEntries(textfield);
      const initialCount = formFieldRegistry.getAll().length;

      const mockEvent = { stopPropagation: () => {} };

      // when
      entries.delete.action(mockEvent);

      // then
      expect(formFieldRegistry.getAll().length).to.be.lessThan(initialCount);
      expect(formFieldRegistry.get('Textfield_1')).not.to.exist;
    }));
  });
});
