import { fireEvent, render } from '@testing-library/preact/pure';

import Datetime from '../../../../../src/render/components/form-fields/Datetime';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

let container;

const spy = sinon.spy;

describe('Datetime', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  describe('(date)', function() {

    it('should render', function() {

      // when
      const { container } = createDatetime();

      // then
      const formField = container.querySelector('.fjs-form-field');
      expect(formField).to.exist;
      expect(formField.classList.contains('fjs-form-field-datetime')).to.be.true;

      const dateLabel = formField.querySelector('label');
      expect(dateLabel).to.exist;
      expect(dateLabel.textContent).to.equal('Date');

      const dateInput = formField.querySelector('input[type="text"]');
      expect(dateInput).to.exist;
      expect(dateInput.value).to.be.empty;
      expect(dateInput.placeholder).to.equal('mm/dd/yyyy');


      const adornment = formField.querySelector('.fjs-input-adornment');
      expect(adornment).to.exist;

    });


    it('should render required label', function() {

      // when
      const { container } = createDatetime({
        field: {
          ...dateField,
          dateLabel: 'Required',
          validate: {
            required: true
          }
        }
      });

      const dateLabel = container.querySelector('label');
      expect(dateLabel).to.exist;
      expect(dateLabel.textContent).to.equal('Required*');
    });


    it('should render value', function() {

      // when
      const { container } = createDatetime({ field: dateField, value: '1996-11-13' });

      // then
      const dateInput = container.querySelector('input[type="text"]');
      expect(dateInput).to.exist;
      expect(dateInput.value).to.be.equal('11/13/1996');

    });


    it('should render disabled', function() {

      // when
      const { container } = createDatetime({ disabled: true, value: '1996-11-13' });

      // then
      const dateInput = container.querySelector('input[type="text"]');
      expect(dateInput).to.exist;
      expect(dateInput.value).to.be.equal('11/13/1996');
      expect(dateInput.disabled).to.be.true;

    });


    it('should render readonly', function() {

      // when
      const { container } = createDatetime({ readonly: true, value: '1996-11-13' });

      // then
      const dateInput = container.querySelector('input[type="text"]');
      expect(dateInput).to.exist;
      expect(dateInput.value).to.be.equal('11/13/1996');
      expect(dateInput.readOnly).to.be.true;

    });


    it('should render custom label', function() {

      // when
      const { container } = createDatetime({ field: { ...dateField, dateLabel: 'Birthday' } });

      const dateLabel = container.querySelector('label');
      expect(dateLabel).to.exist;
      expect(dateLabel.textContent).to.equal('Birthday');

    });


    it('should render calendar', function() {

      // when
      const { container } = createDatetime({ field: { ...dateField } });

      // then
      const calendar = container.querySelector('.flatpickr-calendar');
      expect(calendar).to.exist;

    });


    describe('change handling', function() {

      it('should change date (keyboard)', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');

        fireEvent.input(dateInput, { target: { value: '01/01/2000' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '2000-01-01'
        });
      });


      it('should change date (mouse)', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
        fireEvent.click(firstDayNode);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '1996-10-27'
        });
      });


      it('should clear date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');

        fireEvent.input(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: null
        });
      });
    });


    describe('interaction', function() {

      it('should navigate to next month and select date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const nextMonthButton = container.querySelector('.flatpickr-next-month');
        fireEvent.click(nextMonthButton);

        const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
        fireEvent.click(firstDayNode);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '1996-12-01'
        });
      });


      it('should navigate to previous month and select date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const prevMonthButton = container.querySelector('.flatpickr-prev-month');
        fireEvent.click(prevMonthButton);

        const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
        fireEvent.click(firstDayNode);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '1996-09-29'
        });
      });


      it('should navigate to specific month and select date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const monthSelect = container.querySelector('.flatpickr-monthDropdown-months');
        fireEvent.change(monthSelect, { target: { value: 0 } });

        const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
        fireEvent.click(firstDayNode);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '1995-12-31'
        });
      });

    });


    describe('configuration', function() {

      it('should disable past dates', function() {

        // given
        const { container } = createDatetime({
          value: '1996-11-13',
          field: {
            ...dateField,
            disallowPassedDates: true
          }
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const previousMonthButton = container.querySelector('.flatpickr-prev-month');

        // then
        expect(dateInput.value).to.be.empty;
        expect([ ...previousMonthButton.classList ]).to.include('flatpickr-disabled');
      });

    });


    it('should disable dates prior to 1900', function() {

      // given
      const { container } = createDatetime({
        value: '1900-01-01',
        field: {
          ...dateField,
          disallowPassedDates: false
        }
      });

      // when
      const dateInput = container.querySelector('input[type="text"]');
      fireEvent.focus(dateInput);

      const previousMonthButton = container.querySelector('.flatpickr-prev-month');

      // then
      expect([ ...previousMonthButton.classList ]).to.include('flatpickr-disabled');
    });

  });


  describe('(time)', function() {

    it('should render', function() {

      // when
      const { container } = createDatetime({ field: timeField });

      // then
      const formField = container.querySelector('.fjs-form-field');
      expect(formField).to.exist;
      expect(formField.classList.contains('fjs-form-field-datetime')).to.be.true;

      const timeLabel = formField.querySelector('label');
      expect(timeLabel).to.exist;
      expect(timeLabel.textContent).to.equal('Time');

      const timeInput = formField.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.be.empty;
      expect(timeInput.placeholder).to.equal('hh:mm ?m');


      const adornment = formField.querySelector('.fjs-input-adornment');
      expect(adornment).to.exist;

    });


    it('should render required label', function() {

      // when
      const { container } = createDatetime({
        field: {
          ...timeField,
          timeLabel: 'Required',
          validate: {
            required: true
          }
        }
      });

      const dateLabel = container.querySelector('label');
      expect(dateLabel).to.exist;
      expect(dateLabel.textContent).to.equal('Required*');
    });


    it('should render 24h placeholder', function() {

      // when
      const { container } = createDatetime({ field: { ...timeField, use24h: true } });

      // then
      const timeInput = container.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.be.empty;
      expect(timeInput.placeholder).to.equal('hh:mm');

    });


    it('should render value', function() {

      // when
      const { container } = createDatetime({ field: timeField, value: '13:00' });

      // then
      const timeInput = container.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.equal('01:00 PM');

    });


    it('should render 24h value', function() {

      // when
      const { container } = createDatetime({ field: { ...timeField, use24h: true }, value: '13:00' });

      // then
      const timeInput = container.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.equal('13:00');

    });


    it('should render disabled', function() {

      // when
      const { container } = createDatetime({ field: { ...timeField, use24h: true }, disabled: true, value: '13:00' });

      // then
      const timeInput = container.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.equal('13:00');
      expect(timeInput.disabled).to.be.true;

    });


    it('should render readonly', function() {

      // when
      const { container } = createDatetime({ field: { ...timeField, use24h: true }, readonly: true, value: '13:00' });

      // then
      const timeInput = container.querySelector('input[type="text"]');
      expect(timeInput).to.exist;
      expect(timeInput.value).to.equal('13:00');
      expect(timeInput.readOnly).to.be.true;

    });


    it('should render custom label', function() {

      // when
      const { container } = createDatetime({ field: { ...timeField, timeLabel: 'Alarm time' } });

      const timeLabel = container.querySelector('label');
      expect(timeLabel).to.exist;
      expect(timeLabel.textContent).to.equal('Alarm time');

    });


    describe('dropdown', function() {

      it('should not render by default', function() {

        // when
        const { container } = createDatetime({ field: { ...timeField } });

        const dropdown = container.querySelector('fjs-dropdownlist');
        expect(dropdown).to.not.exist;

      });


      it('should render on input focus', function() {

        // when
        const { container } = createDatetime({ field: timeField });

        const timeInput = container.querySelector('input[type="text"]');
        fireEvent.focus(timeInput);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        expect(dropdown).to.exist;

        const dropdownValues = dropdown.querySelectorAll('.fjs-dropdownlist-item');
        expect(dropdownValues.length).to.equal(4 * 24);

        const focusedItem = dropdown.querySelector('.fjs-dropdownlist-item.focused');
        const firstItem = dropdownValues[0];
        const secondItem = dropdownValues[1];
        const midItem = dropdownValues[48];

        expect(firstItem.innerText).to.equal('12:00 AM');
        expect(secondItem.innerText).to.equal('12:15 AM');
        expect(midItem.innerText).to.equal('12:00 PM');

        expect(midItem).to.equal(focusedItem);

      });


      it('should render custom increment', function() {

        // when
        const { container } = createDatetime({ field: { ...timeField, timeInterval: 30 } });

        const timeInput = container.querySelector('input[type="text"]');
        fireEvent.focus(timeInput);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        expect(dropdown).to.exist;

        const dropdownValues = dropdown.querySelectorAll('.fjs-dropdownlist-item');
        expect(dropdownValues.length).to.equal(48);

        const firstItem = dropdownValues[0];
        const secondItem = dropdownValues[1];

        expect(firstItem.innerText).to.equal('12:00 AM');
        expect(secondItem.innerText).to.equal('12:30 AM');

      });


      it('should render 24h', function() {

        // when
        const { container } = createDatetime({ field: { ...timeField, use24h: true } });

        const timeInput = container.querySelector('input[type="text"]');
        fireEvent.focus(timeInput);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        expect(dropdown).to.exist;

        const dropdownValues = dropdown.querySelectorAll('.fjs-dropdownlist-item');
        expect(dropdownValues.length).to.equal(4 * 24);

        const firstItem = dropdownValues[0];
        const secondItem = dropdownValues[1];

        expect(firstItem.innerText).to.equal('00:00');
        expect(secondItem.innerText).to.equal('00:15');

      });


      it('should not render for 1m increments', function() {

        // when
        const { container } = createDatetime({ field: { ...timeField, timeInterval: 1 } });

        const timeInput = container.querySelector('input[type="text"]');
        fireEvent.focus(timeInput);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        expect(dropdown).to.not.exist;

      });


      it('should focus current value on open', function() {

        // when
        const { container } = createDatetime({ field: { ...timeField, use24h: true }, value: '11:00' });

        const timeInput = container.querySelector('input[type="text"]');
        fireEvent.focus(timeInput);

        // then
        const dropdown = container.querySelector('.fjs-dropdownlist');
        const focusedItem = dropdown.querySelector('.fjs-dropdownlist-item.focused');

        expect(focusedItem.innerText).to.equal('11:00');

      });

    });


    describe('change handling', function() {

      it('should change time (24h)', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: timeField,
          onChange: onChangeSpy,
          value: '11:00'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');

        fireEvent.input(dateInput, { target: { value: '13:00' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: timeField,
          value: '13:00'
        });
      });


      it('should change time (AM/PM)', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: timeField,
          onChange: onChangeSpy,
          value: '11:00'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');

        fireEvent.input(dateInput, { target: { value: '1PM' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: timeField,
          value: '13:00'
        });
      });


      it('should clear time', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: timeField,
          onChange: onChangeSpy,
          value: '11:00'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');

        fireEvent.input(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: timeField,
          value: null
        });
      });
    });

  });


  describe('(datetime)', function() {

    it('should render both date and time', function() {

      // when
      const { container } = createDatetime({ field: datetimeField });

      // then
      const formField = container.querySelector('.fjs-form-field');
      expect(formField).to.exist;
      expect(formField.classList.contains('fjs-form-field-datetime')).to.be.true;

      const dateTimeLabels = formField.querySelectorAll('label');
      expect(dateTimeLabels.length).to.equal(2);
      expect(dateTimeLabels[0].textContent).to.equal('Date');
      expect(dateTimeLabels[1].textContent).to.equal('Time');

      const dateTimeInputs = formField.querySelectorAll('input[type="text"]');
      expect(dateTimeInputs.length).to.equal(2);
      expect(dateTimeInputs[0].value).to.be.empty;
      expect(dateTimeInputs[0].placeholder).to.equal('mm/dd/yyyy');
      expect(dateTimeInputs[1].value).to.be.empty;
      expect(dateTimeInputs[1].placeholder).to.equal('hh:mm ?m');

      const adornments = formField.querySelectorAll('.fjs-input-adornment');
      expect(adornments.length).to.equal(2);

    });


    it('should render required labels', function() {

      // when
      const { container } = createDatetime({
        label: 'Required',
        field: {
          ...datetimeField,
          dateLabel: 'Required_date',
          timeLabel: 'Required_time',
          validate: {
            required: true
          }
        }
      });

      const dateTimeLabels = container.querySelectorAll('label');
      expect(dateTimeLabels.length).to.equal(2);
      expect(dateTimeLabels[0].textContent).to.equal('Required_date*');
      expect(dateTimeLabels[1].textContent).to.equal('Required_time*');
    });

    it('should render date label with height when time label is not empty', () => {

      // when
      const { container } = createDatetime({ field: { ...datetimeField, dateLabel: undefined } });

      // then
      const dateTimeLabels = container.querySelectorAll('label');
      expect(dateTimeLabels.length).to.equal(2);

      const dateLabel = dateTimeLabels[0];
      const timeLabel = dateTimeLabels[1];

      expect(dateLabel.offsetHeight).to.equal(timeLabel.offsetHeight);
      expect(dateLabel.offsetHeight).to.equal(16);
    });


    it('should render time label with height when date label is not empty', () => {

      // when
      const { container } = createDatetime({ field: { ...datetimeField, timeLabel: undefined } });

      // then
      const dateTimeLabels = container.querySelectorAll('label');
      expect(dateTimeLabels.length).to.equal(2);

      const dateLabel = dateTimeLabels[0];
      const timeLabel = dateTimeLabels[1];

      expect(dateLabel.offsetHeight).to.equal(timeLabel.offsetHeight);
      expect(timeLabel.offsetHeight).to.equal(16);
    });


    it('should render labels without height when both are empty', () => {

      // when
      const { container } = createDatetime({ field: { ...datetimeField, dateLabel: undefined, timeLabel: undefined } });

      // then
      const dateTimeLabels = container.querySelectorAll('label');
      expect(dateTimeLabels.length).to.equal(2);

      const dateLabel = dateTimeLabels[0];
      const timeLabel = dateTimeLabels[1];

      expect(dateLabel.offsetHeight).to.equal(timeLabel.offsetHeight);
      expect(timeLabel.offsetHeight).to.equal(0);
    });


    it('should render value', function() {

      // when
      const { container } = createDatetime({
        field: {
          ...datetimeField,
          use24h: true
        },
        value: '1996-11-13T10:00'
      });

      const inputs = container.querySelectorAll('input[type="text"]');

      expect(inputs).to.exist;

      const dateInput = inputs[0];
      const timeInput = inputs[1];

      // then
      expect(dateInput).to.exist;
      expect(timeInput).to.exist;
      expect(dateInput.value).to.be.equal('11/13/1996');
      expect(timeInput.value).to.be.equal('10:00');

    });


    it('should display an error state if only date is set', function() {

      // given
      const { container } = createDatetime({ field: datetimeField });
      const dateInput = container.querySelectorAll('input[type="text"]')[0];

      // when
      fireEvent.input(dateInput, { target: { value: '01/01/2000' } });
      fireEvent.blur(dateInput);

      // then
      const errorGroup = container.querySelector('.fjs-form-field-error');
      expect(errorGroup).to.exist;

      const errorItem = errorGroup.querySelector('li');

      expect(errorItem).to.exist;
      expect(errorItem.innerText).to.equal('Date and time must both be entered.');

    });


    it('should display an error state if only time is set', function() {

      // given
      const { container } = createDatetime({ field: datetimeField });

      expect(container).to.exist;

      const timeInput = container.querySelectorAll('input[type="text"]')[1];

      // when
      fireEvent.input(timeInput, { target: { value: '10:00' } });
      fireEvent.blur(timeInput);

      // then
      const errorGroup = container.querySelector('.fjs-form-field-error');
      expect(errorGroup).to.exist;

      const errorItem = errorGroup.querySelector('li');
      expect(errorItem).to.exist;
      expect(errorItem.innerText).to.equal('Date and time must both be entered.');

    });


    describe('change handling', function() {

      it('should change date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: datetimeField,
          onChange: onChangeSpy,
          value: '1996-11-13T11:00'
        });

        // when
        const dateInput = container.querySelectorAll('input[type="text"]')[0];

        fireEvent.input(dateInput, { target: { value: '01/01/2000' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: datetimeField,
          value: '2000-01-01T11:00'
        });
      });


      it('should change time', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: { ...datetimeField, use24h: true },
          onChange: onChangeSpy,
          value: '1996-11-13T11:00'
        });

        // when
        const timeInput = container.querySelectorAll('input[type="text"]')[1];

        fireEvent.input(timeInput, { target: { value: '12:00' } });
        fireEvent.blur(timeInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: { ...datetimeField, use24h: true },
          value: '1996-11-13T12:00'
        });
      });


      it('should clear from date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: datetimeField,
          onChange: onChangeSpy,
          value: '1996-11-13T10:00'
        });

        // when
        const dateInput = container.querySelectorAll('input[type="text"]')[0];

        fireEvent.input(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: datetimeField,
          value: null
        });
      });


      it('should clear from time', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          field: datetimeField,
          onChange: onChangeSpy,
          value: '1996-11-13T10:00'
        });

        // when
        const dateInput = container.querySelectorAll('input[type="text"]')[1];

        fireEvent.input(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: datetimeField,
          value: null
        });
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Datetime;
    expect(config.type).to.eql('datetime');
    expect(config.label).to.eql('Date time');
    expect(config.group).to.eql('basic-input');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      subtype: 'date',
      dateLabel: 'Date',
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


  describe('a11y', function() {

    it('should have no violations - date', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly - date', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({ readonly: true });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors - date', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - time', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: timeField
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly - time', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: timeField,
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors - time', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: timeField,
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - datetime', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: datetimeField
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly - datetime', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: datetimeField,
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors - datetime', async function() {

      // given
      this.timeout(5000);

      const { container } = createDatetime({
        field: datetimeField,
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const dateField = {
  id: 'Field_1lkciix',
  subtype: 'date',
  dateLabel: 'Date',
  type: 'datetime',
  key: 'field_00rtqsi'
};

const timeField = {
  subtype: 'time',
  type: 'datetime',
  id: 'Field_1lkciix',
  key: 'field_00rtqsi',
  timeLabel: 'Time',
  timeSerializingFormat: 'no_timezone',
  timeInterval: 15
};

const datetimeField = {
  subtype: 'datetime',
  dateLabel: 'Date',
  type: 'datetime',
  id: 'Field_1lkciix',
  key: 'field_00rtqsi',
  timeLabel: 'Time',
  timeSerializingFormat: 'no_timezone',
  timeInterval: 15
};

function createDatetime(options = {}) {
  const {
    disabled,
    readonly,
    field = dateField,
    value,
    onChange = () => {},
    errors
  } = options;

  return render(WithFormContext(
    <Datetime
      disabled={ disabled }
      readonly={ readonly }
      field={ field }
      value={ value }
      onChange={ onChange }
      errors={ errors } />,
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}