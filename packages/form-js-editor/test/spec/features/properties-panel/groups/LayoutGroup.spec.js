import {
  cleanup,
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import { LayoutGroup } from '../../../../../src/features/properties-panel/groups';

import { AUTO_OPTION_VALUE } from '../../../../../src/features/properties-panel/entries/ColumnsEntry';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';


describe('LayoutGroup', function() {

  afterEach(() => cleanup());


  it('should NOT render for default', function() {

    // given
    const field = { type: 'default' };

    const group = LayoutGroup(field);

    // then
    expect(group).to.not.exist;
  });


  describe('columns', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderLayoutGroup({ field });

      // then
      const columnsSelect = findSelect('columns', container);

      expect(columnsSelect).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        layout: {
          columns: 8
        }
      };

      // when
      const { container } = renderLayoutGroup({ field });

      // then
      const columnsSelect = findSelect('columns', container);

      // then
      expect(columnsSelect).to.exist;
      expect(columnsSelect.value).to.equal('8');
    });


    it('should read - auto', function() {

      // given
      const field = {
        type: 'textfield'
      };

      // when
      const { container } = renderLayoutGroup({ field });

      // then
      const columnsSelect = findSelect('columns', container);

      // then
      expect(columnsSelect).to.exist;
      expect(columnsSelect.value).to.equal(AUTO_OPTION_VALUE);
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        layout: {
          columns: 8
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderLayoutGroup({ field, editField: editFieldSpy });

      const columns = findSelect('columns', container);

      // when
      fireEvent.input(columns, { target: { value: '6' } });

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'layout' ], { columns: 6 });
      expect(field.layout.columns).to.equal(6);
    });


    it('should write - empty', function() {

      // given
      const field = {
        type: 'textfield',
        layout: {
          columns: 8
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderLayoutGroup({ field, editField: editFieldSpy });

      const columns = findSelect('columns', container);

      // when
      fireEvent.input(columns, { target: { value: '' } });

      // then
      expect(editFieldSpy).to.have.been.calledWith(field, [ 'layout' ], { columns: null });
      expect(field.layout.columns).to.equal(null);
    });


    it('should validate', function() {

      // given
      const field = {
        type: 'textfield',
        layout: {
          columns: 8
        }
      };

      const editFieldSpy = sinon.spy();

      const validate = (_, value) => {
        if (value === 6) {
          return '6 is not allowed';
        }
      };

      const { container } = renderLayoutGroup({
        field,
        editField: editFieldSpy,
        services: {
          formLayoutValidator: {
            validateField: validate
          }
        }
      });

      const columns = findSelect('columns', container);

      // when
      fireEvent.input(columns, { target: { value: 6 } });

      // then
      expect(editFieldSpy).not.to.have.been.called;
      const error = screen.getByText('6 is not allowed');
      expect(error).to.exist;
    });

  });

});


// helper ///////////////

function renderLayoutGroup(options) {
  const {
    editField,
    field,
    services
  } = options;

  const groups = [ LayoutGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  }), services));
}

function findSelect(id, container) {
  return container.querySelector(`select[name="${id}"]`);
}