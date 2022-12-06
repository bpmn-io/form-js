import { fireEvent, render } from '@testing-library/preact/pure';

import Datetime from '../../../../../src/render/components/form-fields/Datetime';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

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
      expect(dateInput.placeholder).to.equal('MM/DD/YYYY');


      const adornment = formField.querySelector('.fjs-input-adornment');
      expect(adornment).to.exist;

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
      const { container } = createDatetime({ disabled: true });

      // then
      const dateInput = container.querySelector('input[type="text"]');
      expect(dateInput).to.exist;
      expect(dateInput.value).to.be.empty;
      expect(dateInput.disabled).to.be.true;

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


      it.skip('should navigate to year and select date', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createDatetime({
          onChange: onChangeSpy,
          value: '1996-11-13'
        });

        // when
        const dateInput = container.querySelector('input[type="text"]');
        fireEvent.focus(dateInput);

        const yearInput = container.querySelector('.cur-year');
        fireEvent.keyDown(yearInput, { key: 'ArrowDown', code: 'ArrowDown' });

        const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
        fireEvent.click(firstDayNode);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dateField,
          value: '1995-10-29'
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

        const nextMonthButton = container.querySelector('.flatpickr-prev-month');

        // then
        expect(dateInput.value).to.be.empty;
        expect([ ...nextMonthButton.classList ]).to.include('flatpickr-disabled');
      });

    });

  });


  // describe('(time)', function() {

  //   it('should render', function() {

  //     // when
  //     const { container } = createDatetime({ field: timeField });

  //     // then
  //     const formField = container.querySelector('.fjs-form-field');
  //     expect(formField).to.exist;
  //     expect(formField.classList.contains('fjs-form-field-datetime')).to.be.true;

  //     const dateLabel = formField.querySelector('label');
  //     expect(dateLabel).to.exist;
  //     expect(dateLabel.textContent).to.equal('Time');

  //     const dateInput = formField.querySelector('input[type="text"]');
  //     expect(dateInput).to.exist;
  //     expect(dateInput.value).to.be.empty;
  //     expect(dateInput.placeholder).to.equal('HH:MM ?M');


  //     const adornment = formField.querySelector('.fjs-input-adornment');
  //     expect(adornment).to.exist;

  //   });


  //   it('should render 24h placeholder', function() {

  //     // when
  //     const { container } = createDatetime({ field: { ...timeField, use24h: true } });

  //     // then
  //     const dateInput = container.querySelector('input[type="text"]');
  //     expect(dateInput).to.exist;
  //     expect(dateInput.value).to.be.empty;
  //     expect(dateInput.placeholder).to.equal('HH:MM');

  //   });


  //   it('should render value', function() {

  //     // when
  //     const { container } = createDatetime({ field: timeField, value: '1:00 PM' });

  //     // then
  //     const dateInput = container.querySelector('input[type="text"]');
  //     expect(dateInput).to.exist;
  //     expect(dateInput.value).to.be.equal('12:00 PM');

  //   });


  //   it('should render 24h value', function() {

  //     // when
  //     const { container } = createDatetime({ field: { ...timeField, use24h: true }, value: '12:00' });

  //     // then
  //     const dateInput = container.querySelector('input[type="text"]');
  //     expect(dateInput).to.exist;
  //     expect(dateInput.value).to.be.equal('12:00 PM');

  //   });


  //   it('should render disabled', function() {

  //     // when
  //     const { container } = createDatetime({ disabled: true });

  //     // then
  //     const dateInput = container.querySelector('input[type="text"]');
  //     expect(dateInput).to.exist;
  //     expect(dateInput.value).to.be.empty;
  //     expect(dateInput.disabled).to.be.true;

  //   });


  //   it('should render custom label', function() {

  //     // when
  //     const { container } = createDatetime({ field: { ...dateField, dateLabel: 'Birthday' } });

  //     const dateLabel = container.querySelector('label');
  //     expect(dateLabel).to.exist;
  //     expect(dateLabel.textContent).to.equal('Birthday');

  //   });


  //   it('should render calendar', function() {

  //     // when
  //     const { container } = createDatetime({ field: { ...dateField } });

  //     // then
  //     const calendar = container.querySelector('.flatpickr-calendar');
  //     expect(calendar).to.exist;

  //   });


  //   describe('change handling', function() {

  //     it('should change date (keyboard)', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');

  //       fireEvent.input(dateInput, { target: { value: '01/01/2000' } });
  //       fireEvent.blur(dateInput);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '2000-01-01'
  //       });
  //     });


  //     it('should change date (mouse)', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
  //       fireEvent.click(firstDayNode);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '1996-10-27'
  //       });
  //     });


  //     it('should clear date', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');

  //       fireEvent.input(dateInput, { target: { value: '' } });
  //       fireEvent.blur(dateInput);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: null
  //       });
  //     });
  //   });


  //   describe('interaction', function() {

  //     it('should navigate to next month and select date', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const nextMonthButton = container.querySelector('.flatpickr-next-month');
  //       fireEvent.click(nextMonthButton);

  //       const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
  //       fireEvent.click(firstDayNode);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '1996-12-01'
  //       });
  //     });


  //     it('should navigate to previous month and select date', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const prevMonthButton = container.querySelector('.flatpickr-prev-month');
  //       fireEvent.click(prevMonthButton);

  //       const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
  //       fireEvent.click(firstDayNode);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '1996-09-29'
  //       });
  //     });


  //     it('should navigate to specific month and select date', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const monthSelect = container.querySelector('.flatpickr-monthDropdown-months');
  //       fireEvent.change(monthSelect, { target: { value: 0 } });

  //       const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
  //       fireEvent.click(firstDayNode);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '1995-12-31'
  //       });
  //     });


  //     it.skip('should navigate to year and select date', function() {

  //       // given
  //       const onChangeSpy = spy();

  //       const { container } = createDatetime({
  //         onChange: onChangeSpy,
  //         value: '1996-11-13'
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const yearInput = container.querySelector('.cur-year');
  //       fireEvent.keyDown(yearInput, { key: 'ArrowDown', code: 'ArrowDown' });

  //       const firstDayNode = container.querySelectorAll('.flatpickr-day')[0];
  //       fireEvent.click(firstDayNode);

  //       // then
  //       expect(onChangeSpy).to.have.been.calledWith({
  //         field: dateField,
  //         value: '1995-10-29'
  //       });
  //     });

  //   });


  //   describe('configuration', function() {

  //     it('should disable past dates', function() {

  //       // given
  //       const { container } = createDatetime({
  //         value: '1996-11-13',
  //         field: {
  //           ...dateField,
  //           disallowPassedDates: true
  //         }
  //       });

  //       // when
  //       const dateInput = container.querySelector('input[type="text"]');
  //       fireEvent.focus(dateInput);

  //       const nextMonthButton = container.querySelector('.flatpickr-prev-month');

  //       // then
  //       expect(dateInput.value).to.be.empty;
  //       expect([ ...nextMonthButton.classList ]).to.include('flatpickr-disabled');
  //     });

  //   });

  // });


  it('#create', function() {

    // assume
    expect(Datetime.type).to.eql('datetime');
    expect(Datetime.label).to.not.exist;
    expect(Datetime.keyed).to.be.true;

    // when
    const field = Datetime.create();

    // then
    expect(field).to.eql({
      subtype: 'date',
      dateLabel: 'Date',
    });

    // but when
    const customField = Datetime.create({
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
      this.timeout(5000);

      const { container } = createDatetime();

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
  timeSerializingFormat: 'utc_offset',
  timeInterval: 15
};

const datetimeField = {
  subtype: 'datetime',
  dateLabel: 'Date',
  type: 'datetime',
  id: 'Field_1lkciix',
  key: 'field_00rtqsi',
  timeLabel: 'Time',
  timeSerializingFormat: 'utc_offset',
  timeInterval: 15
};

function createDatetime(options = {}) {
  const {
    disabled,
    field = dateField,
    value,
    onChange = () => {}
  } = options;

  return render(
    <Datetime
      disabled={ disabled }
      field={ field }
      value={ value }
      onChange={ onChange } />,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}