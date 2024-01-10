import {
  bootstrapFormEditor,
  inject
} from '../../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../../form.json';


describe('features/modeling - PathBehavior', function() {

  beforeEach(bootstrapFormEditor(schema, {
    additionalModules: [
      ModelingModule
    ]
  }));

  it('should unclaim path on form field remove', inject(function(formFieldRegistry, pathRegistry, modeling) {

    // given
    const group = formFieldRegistry.get('Group_1'),
          parent = formFieldRegistry.get('Form_1'),
          sourceIndex = parent.components.indexOf(group);

    // then
    expect(pathRegistry.canClaimPath([ 'invoiceDetails' ], { isClosed: true })).to.be.false;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails', 'supplementaryInfo1' ], { isClosed: true })).to.be.false;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails', 'supplementaryInfo2' ], { isClosed: true })).to.be.false;

    // but when
    modeling.removeFormField(
      group,
      parent,
      sourceIndex
    );

    // then
    expect(pathRegistry.canClaimPath([ 'invoiceDetails' ], true)).to.be.true;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails', 'supplementaryInfo1' ], true)).to.be.true;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails', 'supplementaryInfo2' ], true)).to.be.true;
  }));


  it('should unclaim old path and claim new path on form field edit', inject(function(formFieldRegistry, pathRegistry, modeling) {

    // given
    const group = formFieldRegistry.get('Group_1');
    const oldPath = group.path;

    // when
    modeling.editFormField(
      group,
      'path',
      'invoiceDetails2'
    );

    // then
    expect(pathRegistry.canClaimPath([ oldPath ], { isClosed: true })).to.be.true;
    expect(pathRegistry.canClaimPath([ oldPath, 'supplementaryInfo1' ], { isClosed: true })).to.be.true;
    expect(pathRegistry.canClaimPath([ oldPath, 'supplementaryInfo2' ], { isClosed: true })).to.be.true;

    expect(pathRegistry.canClaimPath([ 'invoiceDetails2' ], { isClosed: true })).to.be.false;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails2', 'supplementaryInfo1' ], { isClosed: true })).to.be.false;
    expect(pathRegistry.canClaimPath([ 'invoiceDetails2', 'supplementaryInfo2' ], { isClosed: true })).to.be.false;
  }));

});
