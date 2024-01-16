import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { SECURITY_ATTRIBUTES_DEFINITIONS } from '@bpmn-io/form-js-viewer';

import { SecurityAttributesGroup } from '../../../../../src/features/properties-panel/groups';

import { TestPropertiesPanel, MockPropertiesPanelContext } from '../helper';


describe('SecurityAttributesGroup', function() {

  afterEach(() => cleanup());


  it('should NOT render for checkbox', function() {

    // given
    const field = { type: 'checkbox' };

    renderSecurityAttributesGroup({ field });

    // then
    expect(findGroup('securityAttributes', document.body)).to.not.exist;
  });

  SECURITY_ATTRIBUTES_DEFINITIONS.forEach(({ property }) => {


    describe(property, function() {

      it('should render for iframe', function() {

        // given
        const field = { type: 'iframe' };

        // when
        const { container } = renderSecurityAttributesGroup({ field });

        // then
        const input = findInput(property, container);

        expect(input).to.exist;
      });


      it('should read', function() {

        // given
        const field = {
          type: 'iframe',
          security: {
            [property]: true
          }
        };

        // when
        const { container } = renderSecurityAttributesGroup({ field });

        const input = findInput(property, container);

        // then
        expect(input).to.exist;
        expect(input.checked).to.equal(true);
      });


      it('should write', async function() {

        // given
        const field = {
          type: 'iframe',
          security: {
            [property]: true
          }
        };

        const editFieldSpy = sinon.spy();

        const { container } = renderSecurityAttributesGroup({ field, editField: editFieldSpy });

        const input = findInput(property, container);

        // when
        fireEvent.click(input);

        // then
        expect(editFieldSpy).to.have.been.calledOnce;
        expect(field.security[property]).to.equal(false);
      });

    });

  });

});


// helper ///////////////

function renderSecurityAttributesGroup(options) {
  const {
    editField,
    field,
    services
  } = options;

  const groups = [ SecurityAttributesGroup(field, editField) ].filter(group => group);

  return render(
    <MockPropertiesPanelContext services={ services }>
      <TestPropertiesPanel
        field={ field }
        groups={ groups } />
    </MockPropertiesPanelContext>
  );
}

function findInput(id, container) {
  return container.querySelector(`input[name="${id}"]`);
}

function findGroup(id, container) {
  return container.querySelector(`.bio-properties-panel-group [data-group-id="group-${id}"]`);
}