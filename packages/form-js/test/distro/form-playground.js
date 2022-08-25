describe('form-playground', function() {

  let container;

  beforeEach(() => {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should expose <FormPlayground> global', function() {

    // when
    const FormPlayground = window.FormPlayground;

    // then
    expect(FormPlayground).to.exist;
    expect(FormPlayground.FormPlayground).to.exist;
  });


  it('should display playground', async function() {

    const { FormPlayground } = window.FormPlayground;

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
    const playground = new FormPlayground({
      container,
      schema,
      data
    });

    // then
    expect(playground).to.exist;
    expect(playground.getState).to.exist;
    expect(playground.setSchema).to.exist;
  });

});