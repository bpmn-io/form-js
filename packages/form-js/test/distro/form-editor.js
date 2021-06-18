describe('form-editor', function() {

  let container;

  beforeEach(() => {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should expose <FormEditor> global', function() {

    // when
    const FormEditor = window.FormEditor;

    // then
    expect(FormEditor).to.exist;
    expect(FormEditor.createFormEditor).to.exist;
    expect(FormEditor.FormEditor).to.exist;
    expect(FormEditor.schemaVersion).to.exist;
  });


  it('should edit form', async function() {

    // given
    const {
      createFormEditor,
      schemaVersion
    } = window.FormEditor;

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
    const editor = await createFormEditor({
      container,
      schema,
      data
    });

    // then
    expect(editor).to.exist;

    // export works, too
    const savedSchema = editor.getSchema();

    expect(savedSchema).to.have.property('schemaVersion', schemaVersion);
  });

});