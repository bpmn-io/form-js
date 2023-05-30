import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { SerializationGroup } from '../../../../../src/features/properties-panel/groups';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';

import { set } from 'min-dash';

describe('SerializationGroup', function() {

  afterEach(() => cleanup());

  it('should NOT render for most types', function() {

    // given
    const types = [ 'default', 'textfield', 'textarea', 'checkbox', 'checklist', 'taglist', 'radio', 'select', 'text', 'image', 'button' ];

    // then
    for (const type of types) {
      const group = SerializationGroup({ type }, () => {});
      expect(group).to.be.null;
    }
  });

  it('should NOT render for datetime(date)', function() {

    // given
    const field = { type: 'datetime', subtype: 'date' };

    // then
    const group = SerializationGroup(field, () => { });
    expect(group).to.be.null;
  });


  describe('time format', function() {

    it('should render for datetime (time)', function() {

      // given
      const field = { type: 'datetime', subtype: 'time' };

      // when
      const { container } = renderSerializationGroup({ field });

      // then
      const timeFormatSelect = findSelect('time-format', container);

      expect(timeFormatSelect).to.exist;
    });


    it('should render for datetime (datetime)', function() {

      // given
      const field = { type: 'datetime', subtype: 'datetime' };

      // when
      const { container } = renderSerializationGroup({ field });

      // then
      const timeFormatSelect = findSelect('time-format', container);

      expect(timeFormatSelect).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'datetime',
        subtype: 'time',
        timeSerializingFormat: 'utc_offset'
      };

      // when
      const { container } = renderSerializationGroup({ field });
      const timeFormatSelect = findSelect('time-format', container);

      // then
      expect(timeFormatSelect).to.exist;
      expect(timeFormatSelect.value).to.equal('utc_offset');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'datetime',
        subtype: 'time',
        timeSerializingFormat: 'utc_offset'
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderSerializationGroup({ field, editField: editFieldSpy });

      const timeFormatSelect = findSelect('time-format', container);

      // when
      fireEvent.input(timeFormatSelect, { target: { value: 'utc_normalized' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.timeSerializingFormat).to.equal('utc_normalized');
    });

  });


  describe('serialize to string', function() {

    it('should render for number', function() {

      // given
      const field = { type: 'number' };

      // when
      const { container } = renderSerializationGroup({ field });
      const serializeToStringInput = findInput('serialize-to-string', container);

      // then

      expect(serializeToStringInput).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'number',
        serializeToString: true
      };

      // when
      const { container } = renderSerializationGroup({ field });
      const serializeToStringInput = findInput('serialize-to-string', container);

      // then
      expect(serializeToStringInput).to.exist;
      expect(serializeToStringInput.checked).to.equal(true);
    });


    it('should write', function() {

      // given
      const field = {
        type: 'number',
        serializeToString: true
      };

      const editFieldSpy = sinon.spy((field, path, value) => set(field, path, value));

      const { container } = renderSerializationGroup({ field, editField: editFieldSpy });

      const serializeToStringInput = findInput('serialize-to-string', container);

      // when
      fireEvent.click(serializeToStringInput);

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.serializeToString).to.equal(false);
    });

  });

});


// helper ///////////////

function renderSerializationGroup(options) {
  const {
    editField,
    field
  } = options;

  const groups = [ SerializationGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  })));
}

function findInput(id, container) {
  return container.querySelector(`input[name="${id}"]`);
}

function findSelect(id, container) {
  return container.querySelector(`select[name="${id}"]`);
}
