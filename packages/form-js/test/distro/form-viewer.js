describe('form-viewer', function() {

  let container;

  beforeEach(() => {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should expose <FormViewer> global', function() {

    // when
    const FormViewer = window.FormViewer;

    // then
    expect(FormViewer).to.exist;
    expect(FormViewer.createForm).to.exist;
    expect(FormViewer.Form).to.exist;
    expect(FormViewer.schemaVersion).to.exist;
  });


  it('should display form', async function() {

    const { createForm } = window.FormViewer;

    const schema = {
      type: 'default',
      components: [
        {
          type: 'text',
          text: 'Apply for a loan'
        },
        {
          key: 'creditor',
          label: 'Creditor',
          type: 'textfield',
          validate: {
            required: true
          }
        }
      ]
    };

    const data = {
      creditor: 'John Doe Company'
    };

    // when
    const form = await createForm({
      container,
      schema,
      data
    });

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form._update).to.exist;
  });

});