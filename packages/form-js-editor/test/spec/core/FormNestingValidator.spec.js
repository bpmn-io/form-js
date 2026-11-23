import { expect } from 'chai';
import { bootstrapFormEditor, inject } from '../../TestHelper';

describe('core/FormNestingValidator', function () {
  beforeEach(bootstrapFormEditor({ type: 'default', components: [] }));

  describe('#validate', function () {
    it('should allow a page inside a multipage container', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('page', 'multipage')).to.not.exist;
    }));

    it('should reject a page outside a multipage container', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('page', 'default')).to.eql('Page can only be placed in: Multi page');
      expect(formNestingValidator.validate('page', 'group')).to.exist;
      expect(formNestingValidator.validate('page', 'dynamiclist')).to.exist;
    }));

    it('should reject anything but a page inside a multipage container', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('textfield', 'multipage')).to.eql('Multi page can only hold: Page');
      expect(formNestingValidator.validate('group', 'multipage')).to.exist;
      expect(formNestingValidator.validate('multipage', 'multipage')).to.exist;
    }));

    it('should allow a multipage container at the top level', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('multipage', 'default')).to.not.exist;
    }));

    it('should reject a multipage container below the top level', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('multipage', 'group')).to.eql('Multi page can only be placed in: the form');
      expect(formNestingValidator.validate('multipage', 'dynamiclist')).to.exist;
      expect(formNestingValidator.validate('multipage', 'page')).to.exist;
    }));

    it('should not constrain unrelated types', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('textfield', 'group')).to.not.exist;
      expect(formNestingValidator.validate('textfield', 'default')).to.not.exist;
    }));

    it('should not constrain unknown types', inject(function (formNestingValidator) {
      // then
      expect(formNestingValidator.validate('unknown', 'group')).to.not.exist;
      expect(formNestingValidator.validate('textfield', 'unknown')).to.not.exist;
    }));

    describe('custom form fields', function () {
      beforeEach(inject(function (formFields) {
        formFields.register('step', {
          config: {
            type: 'step',
            name: 'Step',
            allowedParents: ['wizard', 'group'],
          },
        });

        formFields.register('wizard', {
          config: {
            type: 'wizard',
            name: 'Wizard',
            allowedChildren: ['step'],
          },
        });
      }));

      it('should allow a placement the field declares', inject(function (formNestingValidator) {
        // then
        expect(formNestingValidator.validate('step', 'wizard')).to.not.exist;
        expect(formNestingValidator.validate('step', 'group')).to.not.exist;
      }));

      it('should reject a parent the field does not declare', inject(function (formNestingValidator) {
        // then
        expect(formNestingValidator.validate('step', 'default')).to.eql('Step can only be placed in: Wizard, Group');
      }));

      it('should reject a child the parent does not declare', inject(function (formNestingValidator) {
        // then
        expect(formNestingValidator.validate('textfield', 'wizard')).to.eql('Wizard can only hold: Step');
      }));

      it('should apply to built-in fields', inject(function (formNestingValidator) {
        // then
        expect(formNestingValidator.validate('page', 'wizard')).to.eql('Page can only be placed in: Multi page');
        expect(formNestingValidator.validate('step', 'multipage')).to.eql('Step can only be placed in: Wizard, Group');
      }));
    });
  });
});
