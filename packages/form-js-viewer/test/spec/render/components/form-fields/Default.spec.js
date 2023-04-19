import Default from '../../../../../src/render/components/form-fields/Default';


describe('Default', function() {

  it('#create', function() {

    // assume
    const { config } = Default;
    expect(config.type).to.eql('default');
    expect(config.label).not.to.exist;
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      components: []
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

});