import { bootstrapFormEditor, inject } from '../../TestHelper';

describe('core/FieldFactory', function () {
  const schema = {
    type: 'default',
  };

  beforeEach(bootstrapFormEditor(schema));

  describe('#create', function () {
    it(
      'Button',
      testCreate({
        type: 'button',
        label: 'Button',
        expected: {
          action: 'submit',
        },
      }),
    );

    it(
      'Checkbox',
      testCreate({
        type: 'checkbox',
        label: 'Checkbox',
        keyed: true,
      }),
    );

    it(
      'Checklist',
      testCreate({
        type: 'checklist',
        label: 'Checkbox group',
        keyed: true,
        expected: {
          values: [
            {
              label: 'Value',
              value: 'value',
            },
          ],
        },
      }),
    );

    it(
      'Default',
      testCreate({
        type: 'default',
        keyed: false,
        expected: {
          components: [],
        },
      }),
    );

    it(
      'Number',
      testCreate({
        type: 'number',
        label: 'Number',
        keyed: true,
      }),
    );

    it(
      'Radio',
      testCreate({
        type: 'radio',
        label: 'Radio group',
        keyed: true,
        expected: {
          values: [
            {
              label: 'Value',
              value: 'value',
            },
          ],
        },
      }),
    );

    it(
      'Select',
      testCreate({
        type: 'select',
        label: 'Select',
        keyed: true,
        expected: {
          values: [
            {
              label: 'Value',
              value: 'value',
            },
          ],
        },
      }),
    );

    it(
      'Tag list',
      testCreate({
        type: 'taglist',
        label: 'Tag list',
        keyed: true,
        expected: {
          values: [
            {
              label: 'Value',
              value: 'value',
            },
          ],
        },
      }),
    );

    it(
      'Date time',
      testCreate(
        {
          type: 'datetime',
          keyed: true,
          expected: {
            subtype: 'date',
            dateLabel: 'Date',
          },
        },
        true,
      ),
    );

    it(
      'Text field',
      testCreate({
        type: 'textfield',
        label: 'Text field',
        keyed: true,
      }),
    );

    it(
      'Image view',
      testCreate({
        type: 'image',
      }),
    );
  });

  describe('#create (from import)', function () {
    it(
      'Datetime',
      testCreate(
        {
          type: 'datetime',
          keyed: true,
          initial: {
            subtype: 'time',
            timeLabel: 'Time',
          },
          expected: {
            subtype: 'time',
            timeLabel: 'Time',
          },
        },
        false,
      ),
    );
  });

  describe('id', function () {
    it('should assign ID', inject(function (fieldFactory) {
      // when
      const field = fieldFactory.create({
        type: 'textfield',
      });

      // then
      expect(field.id).to.match(/Field_[a-z|0-9]{7}/);
    }));

    it('should not assign ID', inject(function (fieldFactory) {
      // when
      const field = fieldFactory.create(
        {
          id: 'foo',
          type: 'textfield',
        },
        false,
      );

      // then
      expect(field.id).to.equal('foo');
    }));

    it('should throw if ID already assigned', inject(function (fieldFactory) {
      // given
      fieldFactory.create(
        {
          id: 'foo',
          type: 'textfield',
        },
        false,
      );

      // when
      const create = () =>
        fieldFactory.create(
          {
            id: 'foo',
            type: 'textfield',
          },
          false,
        );

      // then
      expect(create).to.throw('form field with id <foo> already exists');
    }));
  });

  describe('key', function () {
    it('should assign key', inject(function (fieldFactory) {
      // when
      const field = fieldFactory.create({
        type: 'textfield',
      });

      // then
      expect(field.key).to.match(/textfield_[a-z|0-9]+/);
    }));

    it('should not assign key', inject(function (fieldFactory) {
      // when
      const field = fieldFactory.create(
        {
          key: 'foo',
          type: 'textfield',
        },
        false,
      );

      // then
      expect(field.key).to.equal('foo');
    }));

    it('should not assign key (path)', inject(function (fieldFactory) {
      // when
      const field = fieldFactory.create(
        {
          key: 'foo.bar',
          type: 'textfield',
        },
        false,
      );

      // then
      expect(field.key).to.equal('foo.bar');
    }));

    it('should throw if binding path is already claimed (simple key)', inject(function (fieldFactory) {
      // given
      fieldFactory.create(
        {
          key: 'foo',
          type: 'textfield',
        },
        false,
      );

      // when
      const create = () =>
        fieldFactory.create(
          {
            key: 'foo',
            type: 'textfield',
          },
          false,
        );

      // then
      expect(create).to.throw("binding path 'foo' is already claimed");
    }));

    it('should throw if binding path is already claimed (path key)', inject(function (fieldFactory) {
      // given
      fieldFactory.create(
        {
          key: 'foo.bar',
          type: 'textfield',
        },
        false,
      );

      // when
      const create = () =>
        fieldFactory.create(
          {
            key: 'foo.bar',
            type: 'textfield',
          },
          false,
        );

      // then
      expect(create).to.throw("binding path 'foo.bar' is already claimed");
    }));
  });
});

// helpers //////////////

function testCreate(options, isNew = true) {
  const { type, label, keyed = false, initial = {}, expected = {} } = options;

  return inject(function (fieldFactory) {
    // when
    const field = fieldFactory.create({ type, ...initial }, isNew);

    // then
    expect(field.id).to.exist;

    expect(field.type).to.eql(type);

    if (keyed) {
      expect(field.key).to.exist;
    } else {
      expect(field.key).not.to.exist;
    }

    if (label) {
      expect(field.label).to.eql(label);
    } else {
      expect(field.label).not.to.exist;
    }

    expect(field).to.deep.contain(expected);
  });
}
