import {
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import { Select } from '../../../../../src/render/components/form-fields/Select';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

const spy = sinon.spy;

let container;


describe('Select', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  describe('(simple)', () => {

    it('should render', function() {

      // when
      const { container } = createSelect({
        value: 'german'
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.classList.contains('fjs-form-field-select')).to.be.true;

      const inputGroup = formField.querySelector('.fjs-input-group');

      expect(inputGroup).to.exist;

      const display = inputGroup.querySelector('.fjs-select-display');

      expect(display).to.exist;
      expect(display.innerText).to.equal('German');

      const cross = inputGroup.querySelector('.fjs-select-cross');
      expect(cross).to.exist;

      const arrow = inputGroup.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;

      const label = container.querySelector('label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Language');
      expect(label.htmlFor).to.equal('test-select');

      const input = container.querySelector('input');
      expect(input).to.exist;
      expect(input.id).to.equal('test-select');
    });


    it('should render required label', function() {

      // when
      const { container } = createSelect({
        value: 'german',
        field: {
          ...defaultField,
          label: 'Required',
          validate: {
            required: true
          }
        }
      });

      // then
      const label = container.querySelector('label');

      expect(label).to.exist;
      expect(label.textContent).to.equal('Required*');
    });


    it('should render empty state (undefined)', function() {

      // when
      const { container } = createSelect();

      // then
      const select = container.querySelector('.fjs-input-group');

      const display = select.querySelector('.fjs-select-display');
      expect(display.innerText).to.equal('Select');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render empty state (null)', function() {

      // when
      const { container } = createSelect({ value: null });

      // then
      const select = container.querySelector('.fjs-input-group');

      const display = select.querySelector('.fjs-select-display');
      expect(display.innerText).to.equal('Select');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render disabled', function() {

      // when
      const { container } = createSelect({ value: 'german', disabled: true });

      // then
      const select = container.querySelector('.fjs-input-group');
      expect(select.classList.contains('disabled')).to.be.true;

      const display = select.querySelector('.fjs-select-display');
      expect(display.innerText).to.equal('German');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render readonly', function() {

      // when
      const { container } = createSelect({ value: 'german', readonly: true });

      // then
      const select = container.querySelector('.fjs-input-group');
      expect(select.classList.contains('readonly')).to.be.true;

      const display = select.querySelector('.fjs-select-display');
      expect(display.innerText).to.equal('German');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render value changes', function() {

      // given
      const props = {
        disabled: false,
        errors: [],
        field: defaultField,
        onChange: () => {}
      };

      const options = { container: container.querySelector('.fjs-form') };

      const { rerender } = render(
        <MockFormContext options={ options }>
          <Select { ...props } value={ 'german' } />
        </MockFormContext>
        , options);

      // when
      rerender(
        <MockFormContext options={ options }>
          <Select { ...props } value={ 'english' } />
        </MockFormContext>
        , options);

      // then
      const display = container.querySelector('.fjs-select-display');
      expect(display.innerText).to.equal('English');
    });


    it('should render description', function() {

      // when
      const { container } = createSelect({
        field: {
          ...defaultField,
          description: 'foo'
        }
      });

      // then
      const description = container.querySelector('.fjs-form-field-description');

      expect(description).to.exist;
      expect(description.textContent).to.equal('foo');
    });


    it('should render dropdown when focused', function() {

      // when
      const { container } = createSelect();

      const select = container.querySelector('.fjs-input-group');

      // then
      let selectAnchor = container.querySelector('.fjs-select-anchor');
      expect(selectAnchor).to.exist;

      let dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.not.exist;

      fireEvent.focus(select);

      dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.exist;

    });


    it('should close dropdown on blur', function() {

      // given
      const { container } = createSelect();

      const select = container.querySelector('.fjs-input-group');

      // when
      fireEvent.focus(select);

      // assume
      let dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.exist;

      // and when
      fireEvent.blur(select);

      // then
      dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.not.exist;
    });


    it('should focus input on mouse down', function() {

      // given
      const focusSpy = spy();

      const { container } = createSelect({
        onFocus: focusSpy
      });

      const select = container.querySelector('.fjs-input-group');

      // when
      fireEvent.mouseDown(select);

      // then
      expect(focusSpy).to.have.been.called;
    });


    it('should blur input on second mouse down', function() {

      // given
      const blurSpy = spy();

      const { container } = createSelect({
        onBlur: blurSpy
      });

      const select = container.querySelector('.fjs-input-group');

      // when
      fireEvent.mouseDown(select);
      fireEvent.mouseDown(select);

      // then
      expect(blurSpy).to.have.been.called;
    });


    describe('interaction (static data)', function() {

      it('should set value through dropdown', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: null
        });

        const select = container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        const germanSelector = container.querySelector('.fjs-dropdownlist .fjs-dropdownlist-item');
        fireEvent.mouseDown(germanSelector);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: 'german'
        });
      });


      it('should clear', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'german'
        });

        // when
        const cross = container.querySelector('.fjs-select-cross');
        fireEvent.mouseDown(cross);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        expect(dropdown).to.not.exist;
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: null
        });
      });

    });


    describe('interaction (dynamic data, valuesKey)', function() {

      it('should set value through dropdown', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'dynamicValue2',
          field: dynamicField,
          initialData: dynamicFieldInitialData
        });

        const select = container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        const germanSelector = container.querySelector('.fjs-dropdownlist .fjs-dropdownlist-item');

        fireEvent.mouseDown(germanSelector);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dynamicField,
          value: 'dynamicValue1'
        });
      });


      it('should clear', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'dynamicValue1',
          field: dynamicField,
          initialData: dynamicFieldInitialData
        });

        // when
        const cross = container.querySelector('.fjs-select-cross');
        fireEvent.mouseDown(cross);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dynamicField,
          value: null
        });

      });

    });


    describe('interaction (dynamic data, valuesExpression)', function() {

      it('should set value through dropdown', function() {

        // given
        const onChangeSpy = spy();

        const options = [
          ...expressionFieldInitialData.list1,
          ...expressionFieldInitialData.list2
        ];

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'value2',
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options
            }
          }
        });

        const select = container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        const germanSelector = container.querySelector('.fjs-dropdownlist .fjs-dropdownlist-item');

        fireEvent.mouseDown(germanSelector);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: expressionField,
          value: 'value1'
        });
      });


      it('should render options from values expression', function() {

        // given
        const onChangeSpy = spy();

        const options = [
          ...expressionFieldInitialData.list1,
          ...expressionFieldInitialData.list2
        ];

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'value2',
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options
            }
          }
        });

        const select = container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        // then
        expect(getSelectValues(container)).to.eql([
          'Value 1',
          'Value 2',
          'Value 3',
          'Value 4'
        ]);
      });


      it('should update options when evaluation changed', function() {

        // given
        const onChangeSpy = spy();

        const options = [
          ...expressionFieldInitialData.list1,
          ...expressionFieldInitialData.list2
        ];

        let result = createSelect({
          onChange: onChangeSpy,
          value: 'value2',
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options
            }
          }
        });

        const select = result.container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        // assume
        expect(getSelectValues(result.container)).to.eql([
          'Value 1',
          'Value 2',
          'Value 3',
          'Value 4'
        ]);

        // and when
        options.push({ label: 'Value 5', value: 'value5' });

        createSelect({
          field: expressionField,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options
            }
          }
        }, result.rerender);

        // then
        expect(getSelectValues(result.container)).to.eql([
          'Value 1',
          'Value 2',
          'Value 3',
          'Value 4',
          'Value 5'
        ]);

      });


      it('should update options - roundtrip', function() {

        // given
        const onChangeSpy = spy();

        const options = [
          ...expressionFieldInitialData.list1,
          ...expressionFieldInitialData.list2
        ];

        let result = createSelect({
          onChange: onChangeSpy,
          value: 'value2',
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options,
            }
          }
        });

        const select = result.container.querySelector('.fjs-input-group');

        // when
        fireEvent.focus(select);

        // assume
        expect(getSelectValues(result.container)).to.eql([
          'Value 1',
          'Value 2',
          'Value 3',
          'Value 4'
        ]);

        // and when
        createSelect({
          field: dynamicField,
          isExpression: () => false,
          initialData: dynamicFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => false
            }
          }
        }, result.rerender);

        // assume
        expect(getSelectValues(result.container)).to.eql([
          'Dynamic Value 1',
          'Dynamic Value 2'
        ]);

        // and when
        createSelect({
          initialData: expressionFieldInitialData,
          field: {
            ...expressionField,
            valuesExpression: '='
          },
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => null,
            }
          }
        }, result.rerender);

        // assume
        expect(getSelectValues(result.container)).to.eql([]);

        // and when
        createSelect({
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options,
            }
          }
        }, result.rerender);

        // expect
        expect(getSelectValues(result.container)).to.eql([
          'Value 1',
          'Value 2',
          'Value 3',
          'Value 4'
        ]);
      });


      it('should clear', function() {

        // given
        const onChangeSpy = spy();

        const options = [
          ...expressionFieldInitialData.list1,
          ...expressionFieldInitialData.list2
        ];

        const { container } = createSelect({
          onChange: onChangeSpy,
          value: 'value1',
          field: expressionField,
          initialData: expressionFieldInitialData,
          services: {
            expressionLanguage: {
              isExpression: () => true,
              evaluate: () => options
            }
          }
        });

        // when
        const cross = container.querySelector('.fjs-select-cross');
        fireEvent.mouseDown(cross);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: expressionField,
          value: null
        });

      });

    });

  });


  describe('(searchable)', () => {

    it('should render', function() {

      // when
      const { container } = createSelect({
        value: 'german',
        field: { ...defaultField, searchable: true }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.classList.contains('fjs-form-field-select')).to.be.true;

      const inputGroup = formField.querySelector('.fjs-input-group');

      expect(inputGroup).to.exist;

      const filter = container.querySelector('input[type="text"]');

      expect(filter).to.exist;
      expect(filter.value).to.equal('German');

      const cross = inputGroup.querySelector('.fjs-select-cross');
      expect(cross).to.exist;

      const arrow = inputGroup.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;

      const label = container.querySelector('label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Language');
      expect(label.htmlFor).to.equal('test-select');

      const input = container.querySelector('input');
      expect(input).to.exist;
      expect(input.id).to.equal('test-select');
    });


    it('should render empty state (undefined)', function() {

      // when
      const { container } = createSelect({
        field: { ...defaultField, searchable: true }
      });

      // then
      const filter = container.querySelector('input[type="text"]');

      expect(filter).to.exist;
      expect(filter.value).to.equal('');

      const cross = container.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = container.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render empty state (null)', function() {

      // when
      const { container } = createSelect({
        value: null,
        field: { ...defaultField, searchable: true }
      });

      // then
      const filter = container.querySelector('input[type="text"]');

      expect(filter).to.exist;
      expect(filter.value).to.equal('');

      const cross = container.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = container.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render disabled', function() {

      // when
      const { container } = createSelect({
        field: { ...defaultField, searchable: true },
        value: 'german',
        disabled: true
      });

      // then
      const select = container.querySelector('.fjs-input-group');
      expect(select.classList.contains('disabled')).to.be.true;

      const filter = container.querySelector('input[type="text"]');
      expect(filter).to.exist;
      expect(filter.disabled).to.be.true;
      expect(filter.value).to.equal('German');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render readonly', function() {

      // when
      const { container } = createSelect({
        field: { ...defaultField, searchable: true },
        value: 'german',
        readonly: true
      });

      // then
      const select = container.querySelector('.fjs-input-group');
      expect(select.classList.contains('readonly')).to.be.true;

      const filter = container.querySelector('input[type="text"]');
      expect(filter).to.exist;
      expect(filter.readOnly).to.be.true;
      expect(filter.value).to.equal('German');

      const cross = select.querySelector('.fjs-select-cross');
      expect(cross).to.not.exist;

      const arrow = select.querySelector('.fjs-select-arrow');
      expect(arrow).to.exist;
    });


    it('should render value changes', function() {

      // given
      const props = {
        disabled: false,
        errors: [],
        field: { ...defaultField, searchable: true },
        onChange: () => {}
      };

      const options = { container: container.querySelector('.fjs-form') };


      const { rerender } = render(
        <MockFormContext options={ options }>
          <Select { ...props } value={ 'german' } />
        </MockFormContext>
        , options);

      // when
      rerender(
        <MockFormContext options={ options }>
          <Select { ...props } value={ 'english' } />
        </MockFormContext>
        , options);

      // then
      const filter = container.querySelector('input[type="text"]');
      expect(filter.value).to.equal('English');
    });


    it('should render dropdown when focused', function() {

      // when
      const { container } = createSelect({ field: { ...defaultField, searchable: true } });

      const filterInput = container.querySelector('input[type="text"]');

      // then
      let selectAnchor = container.querySelector('.fjs-select-anchor');
      expect(selectAnchor).to.exist;

      let dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.not.exist;

      fireEvent.focus(filterInput);

      dropdownList = container.querySelector('.fjs-dropdownlist');
      expect(dropdownList).to.exist;

    });


    it('should filter dropdown', function() {

      // when
      const eventBusFireSpy = spy();
      const eventBus = {
        fire: eventBusFireSpy
      };

      const field = { ...defaultField, searchable: true };
      const { container } = createSelect({ field, services: { eventBus } });

      const filterInput = container.querySelector('input[type="text"]');
      fireEvent.focus(filterInput);

      const dropdownList = container.querySelector('.fjs-dropdownlist');

      // then
      let listItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
      expect(listItems.length).to.equal(2);

      fireEvent.input(filterInput, { target: { value: 'Ger' } });

      listItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
      expect(listItems.length).to.equal(1);
      expect(listItems[0].innerText).to.equal('German');

      expect(eventBusFireSpy).to.have.been.calledWith('formField.search', {
        formField: field,
        value: 'Ger'
      });

    });


    describe('interaction', function() {

      it('should set value through dropdown', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          field: { ...defaultField, searchable: true },
          onChange: onChangeSpy,
          value: null
        });

        const filterInput = container.querySelector('input[type="text"]');

        // when
        fireEvent.focus(filterInput);

        const germanSelector = container.querySelector('.fjs-dropdownlist .fjs-dropdownlist-item');
        fireEvent.mouseDown(germanSelector);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: { ...defaultField, searchable: true },
          value: 'german'
        });
      });


      it('should not set value through filter only', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          field: { ...defaultField, searchable: true },
          onChange: onChangeSpy,
          value: null
        });

        const filterInput = container.querySelector('input[type="text"]');

        // when
        fireEvent.focus(filterInput);
        fireEvent.input(filterInput, { target: { value: 'English' } });
        fireEvent.blur(filterInput);

        // then
        expect(onChangeSpy).to.not.have.been.called;
      });


      it('should clear', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createSelect({
          field: { ...defaultField, searchable: true },
          onChange: onChangeSpy,
          value: 'german'
        });

        const filterInput = container.querySelector('input[type="text"]');
        const cross = container.querySelector('.fjs-select-cross');

        // when
        fireEvent.mouseDown(cross);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: { ...defaultField, searchable: true },
          value: null
        });

        expect(filterInput.value).to.equal('');
      });


      it('should not submit form on enter', function() {

        // given
        const onSubmitSpy = spy();

        const { container } = createSelect({
          field: { ...defaultField, searchable: true },
          onChange: () => { },
          value: [ 'german' ],
        });

        container.addEventListener('keydown', onSubmitSpy);

        // when
        const input = container.querySelector('.fjs-input');

        fireEvent.focus(input);
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // then

        expect(onSubmitSpy).to.not.have.been.called;
      });

    });

  });


  it('#create', function() {

    // assume
    const { config } = Select;
    expect(config.type).to.eql('select');
    expect(config.label).to.eql('Select');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
    });

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  it('#create - values key', function() {

    // assume
    const { config } = Select;
    expect(config.type).to.eql('select');
    expect(config.label).to.eql('Select');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create({ valuesKey: 'foo' });

    // then
    expect(field.values).to.not.exist;
    expect(field.valuesKey).to.eql('foo');

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  it('#create - values expression', function() {

    // assume
    const { config } = Select;
    expect(config.type).to.eql('select');
    expect(config.label).to.eql('Select');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create({ valuesExpression: '=foo' });

    // then
    expect(field.values).to.not.exist;
    expect(field.valuesExpression).to.eql('=foo');

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'foo'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'foo',
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - hidden select input', async function() {

      // given
      this.timeout(10000);

      createSelect({
        value: 'foo'
      });

      const input = screen.getByLabelText('Language');

      // then
      await expectNoViolations(input);
    });


    it('should have no violations - disabled', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'foo',
        disabled: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - readonly', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'foo',
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - searchable', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'german',
        field: { ...defaultField, searchable: true }
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - searchable, open list', async function() {

      // given
      this.timeout(10000);

      const { container } = createSelect({
        value: 'german',
        field: { ...defaultField, searchable: true }
      });

      const filterInput = screen.getByLabelText('Language');

      // when
      fireEvent.focus(filterInput);

      // then
      await expectNoViolations(container);
    });

  });

});


// helpers //////////

const defaultField = {
  id: 'Select_1',
  key: 'language',
  label: 'Language',
  type: 'select',
  description: 'select',
  values: [
    {
      label: 'German',
      value: 'german'
    },
    {
      label: 'English',
      value: 'english'
    }
  ]
};

const dynamicField = {
  id: 'Select_1',
  key: 'language',
  label: 'Language',
  type: 'select',
  valuesKey: 'dynamicValues'
};

const dynamicFieldInitialData = {
  dynamicValues: [
    {
      label: 'Dynamic Value 1',
      value: 'dynamicValue1'
    },
    {
      label: 'Dynamic Value 2',
      value: 'dynamicValue2'
    }
  ]
};

const expressionField = {
  id: 'Taglist_1',
  key: 'tags',
  label: 'Taglist',
  type: 'taglist',
  valuesExpression: '=concatenate(list1,list2)'
};

const expressionFieldInitialData = {
  list1: [
    {
      label: 'Value 1',
      value: 'value1'
    },
    {
      label: 'Value 2',
      value: 'value2'
    }
  ],
  list2: [
    {
      label: 'Value 3',
      value: 'value3'
    },
    {
      label: 'Value 4',
      value: 'value4'
    }
  ]
};

function createSelect({ services, ...restOptions } = {}, renderFn = render) {

  const options = {
    domId: 'test-select',
    field: defaultField,
    searchable: false,
    onChange: () => {},
    ...restOptions
  };

  return renderFn(
    <MockFormContext
      services={ services }
      options={ options }>
      <Select
        disabled={ options.disabled }
        readonly={ options.readonly }
        errors={ options.errors }
        domId={ options.domId }
        field={ options.field }
        onBlur={ options.onBlur }
        onFocus={ options.onFocus }
        onChange={ options.onChange }
        searchable={ options.searchable }
        value={ options.value } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}

function getSelectValues(container) {
  const listItems = container.querySelectorAll('.fjs-dropdownlist-item');

  return Array.from(listItems).map(listItem => {
    return listItem.innerText;
  });
}