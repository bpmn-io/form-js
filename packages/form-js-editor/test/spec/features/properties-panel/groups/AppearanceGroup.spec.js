import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { AppearanceGroup } from '../../../../../src/features/properties-panel/groups';

import { WithFormEditorContext, WithPropertiesPanel } from '../helper';


describe('AppearanceGroup', function() {

  afterEach(() => cleanup());


  it('should NOT render for checkbox', function() {

    // given
    const field = { type: 'checkbox' };

    const group = AppearanceGroup(field);

    // then
    expect(group).to.not.exist;
  });


  describe('suffixAdorner', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findInput('suffix-adorner', container);

      expect(input).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          suffixAdorner: 'foo'
        }
      };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findInput('suffix-adorner', container);

      // then
      expect(input).to.exist;
      expect(input.value).to.eql('foo');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          suffixAdorner: 'foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const input = findInput('suffix-adorner', container);

      // when
      fireEvent.input(input, { target: { value: 'bar' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.suffixAdorner).to.eql('bar');
    });

  });


  describe('prefixAdorner', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findInput('prefix-adorner', container);

      expect(input).to.exist;
    });


    it('should read', function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          prefixAdorner: 'foo'
        }
      };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findInput('prefix-adorner', container);

      // then
      expect(input).to.exist;
      expect(input.value).to.eql('foo');
    });


    it('should write', function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          prefixAdorner: 'foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const input = findInput('prefix-adorner', container);

      // when
      fireEvent.input(input, { target: { value: 'bar' } });

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.prefixAdorner).to.eql('bar');
    });

  });

});


// helper ///////////////

function renderAppearanceGroup(options) {
  const {
    editField,
    field
  } = options;

  const groups = [ AppearanceGroup(field, editField) ];

  return render(WithFormEditorContext(WithPropertiesPanel({
    field,
    groups
  })));
}

function findInput(id, container) {
  return container.querySelector(`input[name="${id}"]`);
}