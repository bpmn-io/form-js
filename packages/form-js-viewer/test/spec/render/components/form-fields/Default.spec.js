import Default from '../../../../../src/render/components/form-fields/Default';


describe('Default', function() {

  it('#create', function() {

    // assume
    expect(Default.type).to.eql('default');
    expect(Default.label).not.to.exist;
    expect(Default.keyed).to.be.false;

    // when
    const field = Default.create();

    // then
    expect(field).to.eql({
      components: []
    });

    // but when
    const customField = Default.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });

});