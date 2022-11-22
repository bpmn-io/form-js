import Validator from '../../../src/core/Validator';

describe('Validator', function () {
  const validator = new Validator();

  describe('#validateField', function () {
    it('should return no errors', function () {
      // given
      const field = {};

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(0);
    });

    describe('pattern', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            pattern: /foo/,
          },
        };

        // when
        const errors = validator.validateField(field, 'foobar');

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid', function () {
        // given
        const field = {
          validate: {
            pattern: /foo/,
          },
        };

        // when
        const errors = validator.validateField(field, 'barbaz');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must match pattern /foo/.');
      });
    });

    describe('required', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            required: true,
          },
        };

        // when
        const errors = validator.validateField(field, 'foo');

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid (undefined)', function () {
        // given
        const field = {
          validate: {
            required: true,
          },
        };

        // when
        const errors = validator.validateField(field, undefined);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field is required.');
      });

      it('should be invalid (null)', function () {
        // given
        const field = {
          validate: {
            required: true,
          },
        };

        // when
        const errors = validator.validateField(field, null);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field is required.');
      });

      it('should be invalid (empty string)', function () {
        // given
        const field = {
          validate: {
            required: true,
          },
        };

        // when
        const errors = validator.validateField(field, '');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field is required.');
      });
    });

    describe('min', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            min: 100,
          },
        };

        // when
        const errors = validator.validateField(field, 200);

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid', function () {
        // given
        const field = {
          validate: {
            min: 200,
          },
        };

        // when
        const errors = validator.validateField(field, 100);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have minimum value of 200.');
      });
    });

    describe('max', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            max: 200,
          },
        };

        // when
        const errors = validator.validateField(field, 100);

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid', function () {
        // given
        const field = {
          validate: {
            max: 100,
          },
        };

        // when
        const errors = validator.validateField(field, 200);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have maximum value of 100.');
      });
    });

    describe('email pattern', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            validationType: 'email',
          },
        };

        // when
        const errors = validator.validateField(field, 'jon.doe@camunda.com');

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid', function () {
        // given
        const field = {
          validate: {
            validationType: 'email',
          },
        };

        // when
        const errors = validator.validateField(field, 'jon doe');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must be a valid email.');
      });
    });

    describe('phone number pattern', function () {
      it('should be valid', function () {
        // given
        const field = {
          validate: {
            validationType: 'phone',
          },
        };

        // when
        const errors = validator.validateField(field, '+4930664040900');

        // then
        expect(errors).to.have.length(0);
      });

      it('should be invalid', function () {
        // given
        const field = {
          validate: {
            validationType: 'phone',
          },
        };

        // when
        const errors = validator.validateField(field, '1234');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal(
          'Field must be a valid  international phone number. (e.g. +4930664040900)',
        );
      });
    });
  });

  describe('minLength', function () {
    it('should be valid', function () {
      // given
      const field = {
        validate: {
          minLength: 5,
        },
      };

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(0);
    });

    it('should be invalid', function () {
      // given
      const field = {
        validate: {
          minLength: 5,
        },
      };

      // when
      const errors = validator.validateField(field, 'foo');

      // then
      expect(errors).to.have.length(1);
      expect(errors[0]).to.equal('Field must have minimum length of 5.');
    });
  });

  describe('maxLength', function () {
    it('should be valid', function () {
      // given
      const field = {
        validate: {
          maxLength: 5,
        },
      };

      // when
      const errors = validator.validateField(field, 'foo');

      // then
      expect(errors).to.have.length(0);
    });

    it('should be invalid', function () {
      // given
      const field = {
        validate: {
          maxLength: 5,
        },
      };

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(1);
      expect(errors[0]).to.equal('Field must have maximum length of 5.');
    });
  });
});
