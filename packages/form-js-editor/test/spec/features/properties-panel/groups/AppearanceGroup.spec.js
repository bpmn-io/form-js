import {
  cleanup,
  render
} from '@testing-library/preact/pure';

import { AppearanceGroup } from '../../../../../src/features/properties-panel/groups';

import { MockPropertiesPanelContext, TestPropertiesPanel } from '../helper';

import { setEditorValue } from '../../../../helper';


describe('AppearanceGroup', function() {

  afterEach(() => cleanup());


  it('should NOT render for checkbox', function() {

    // given
    const field = { type: 'checkbox' };

    renderAppearanceGroup({ field });

    // then
    expect(findGroup('appearance', document.body)).to.not.exist;
  });


  describe('suffixAdorner', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findFeelers('suffix-adorner', container);

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
      const input = findFeelers('suffix-adorner', container);

      // then
      expect(input).to.exist;
      expect(input.textContent).to.eql('foo');
    });


    it('should write', async function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          suffixAdorner: 'foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const feelers = findFeelers('suffix-adorner', container);
      const input = feelers.querySelector('div[contenteditable="true"]');

      // when
      await setEditorValue(input, 'newVal');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.suffixAdorner).to.eql('newVal');
    });


    it('should write expression', async function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          suffixAdorner: '=foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const input = findTextbox('suffix-adorner', container);

      // when
      await setEditorValue(input, 'newVal');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.suffixAdorner).to.eql('=newVal');
    });

  });


  describe('prefixAdorner', function() {

    it('should render for textfield', function() {

      // given
      const field = { type: 'textfield' };

      // when
      const { container } = renderAppearanceGroup({ field });

      // then
      const input = findFeelers('prefix-adorner', container);

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
      const input = findFeelers('prefix-adorner', container);

      // then
      expect(input).to.exist;
      expect(input.textContent).to.eql('foo');
    });


    it('should write', async function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          prefixAdorner: 'foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const feelers = findFeelers('prefix-adorner', container);

      const input = feelers.querySelector('div[contenteditable="true"]');

      // when
      await setEditorValue(input, 'newVal');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.prefixAdorner).to.eql('newVal');
    });


    it('should write expression', async function() {

      // given
      const field = {
        type: 'textfield',
        appearance: {
          prefixAdorner: '=foo'
        }
      };

      const editFieldSpy = sinon.spy();

      const { container } = renderAppearanceGroup({ field, editField: editFieldSpy });

      const input = findTextbox('prefix-adorner', container);

      // when
      await setEditorValue(input, 'newVal');

      // then
      expect(editFieldSpy).to.have.been.calledOnce;
      expect(field.appearance.prefixAdorner).to.eql('=newVal');
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

  return render(
    <MockPropertiesPanelContext options={ options }>
      <TestPropertiesPanel field={ field } groups={ groups } />
    </MockPropertiesPanelContext>
  );
}

function findFeelers(id, container) {
  return container.querySelector(`[data-entry-id="${id}"] .bio-properties-panel-feelers-editor`);
}

function findTextbox(id, container) {
  return container.querySelector(`[name=${id}] [role="textbox"]`);
}

function findGroup(id, container) {
  return container.querySelector(`.bio-properties-panel-group [data-group-id="group-${id}"]`);
}