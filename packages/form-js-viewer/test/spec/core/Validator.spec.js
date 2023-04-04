import Validator from '../../../src/core/Validator';


describe('Validator', function() {

  const validator = new Validator();


  describe('#validateField', function() {

    it('should return no errors', function() {

      // given
      const field = {};

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(0);
    });


    describe('<number>', function() {

      it('should disallow NaN', function() {

        // given
        const field = {
          type: 'number',
        };

        // when
        const errors = validator.validateField(field, 'NaN');

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Value is not a number.');

      });


      it('should restrict decimals', function() {

        // given
        const field = {
          type: 'number',
          decimalDigits: 3
        };

        // when
        const errors = validator.validateField(field, 3.1256);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Value is expected to have at most 3 decimal digits.');

      });


      it('should restrict decimals (0)', function() {

        // given
        const field = {
          type: 'number',
          decimalDigits: 0
        };

        // when
        const errors = validator.validateField(field, 3.1256);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Value is expected to be an integer.');

      });


      it('should restrict decimals', function() {

        // given
        const field = {
          type: 'number',
          decimalDigits: 3
        };

        // when
        const errors = validator.validateField(field, '3.1415');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Value is expected to have at most 3 decimal digits.');

      });


      it('should restrict increment', function() {

        // given
        const field = {
          type: 'number',
          increment: 0.05
        };

        // when
        const errors = validator.validateField(field, 3.1689);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Please select a valid value, the two nearest valid values are 3.15 and 3.2.');

      });


      it('should restrict increment (string)', function() {

        // given
        const field = {
          type: 'number',
          increment: 0.005
        };

        // when
        const errors = validator.validateField(field, '3.1689');

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Please select a valid value, the two nearest valid values are 3.165 and 3.17.');

      });

    });


    describe('pattern', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            pattern: /foo/
          }
        };

        // when
        const errors = validator.validateField(field, 'foobar');

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid', function() {

        // given
        const field = {
          validate: {
            pattern: /foo/
          }
        };

        // when
        const errors = validator.validateField(field, 'barbaz');

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field must match pattern /foo/.');
      });

    });


    describe('required', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, 'foo');

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid (undefined)', function() {

        // given
        const field = {
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, undefined);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field is required.');
      });


      it('should be invalid (null)', function() {

        // given
        const field = {
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, null);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field is required.');
      });


      it('should be invalid (empty string)', function() {

        // given
        const field = {
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, '');

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field is required.');
      });


      it('should be invalid (checkbox)', function() {

        // given
        const field = {
          type: 'checkbox',
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, false);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field is required.');
      });


      it('should be invalid (multiple)', function() {

        // given
        const field = {
          validate: {
            required: true
          }
        };

        // when
        const errors = validator.validateField(field, []);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field is required.');
      });

    });


    describe('min', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            min: 100
          }
        };

        // when
        const errors = validator.validateField(field, 200);

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid', function() {

        // given
        const field = {
          validate: {
            min: 200
          }
        };

        // when
        const errors = validator.validateField(field, 100);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field must have minimum value of 200.');
      });


      it('should be invalid (zero)', function() {

        // given
        const field = {
          validate: {
            min: 200
          }
        };

        // when
        const errors = validator.validateField(field, 0);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have minimum value of 200.');
      });


      it('should be invalid (negative)', function() {

        // given
        const field = {
          validate: {
            min: -200
          }
        };

        // when
        const errors = validator.validateField(field,-300);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have minimum value of -200.');
      });

    });


    describe('max', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            max: 200
          }
        };

        // when
        const errors = validator.validateField(field, 100);

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid', function() {

        // given
        const field = {
          validate: {
            max: 100
          }
        };

        // when
        const errors = validator.validateField(field, 200);

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field must have maximum value of 100.');
      });


      it('should be invalid (zero)', function() {

        // given
        const field = {
          validate: {
            max: -200
          }
        };

        // when
        const errors = validator.validateField(field, 0);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have maximum value of -200.');
      });


      it('should be invalid (negative)', function() {

        // given
        const field = {
          validate: {
            max: -200
          }
        };

        // when
        const errors = validator.validateField(field, -100);

        // then
        expect(errors).to.have.length(1);
        expect(errors[0]).to.equal('Field must have maximum value of -200.');
      });

    });


    describe('email pattern', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            validationType: 'email'
          }
        };

        // when
        const errors = validator.validateField(field, 'jon.doe@camunda.com');

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid', function() {

        // given
        const field = {
          validate: {
            validationType: 'email'
          }
        };

        // when
        const errors = validator.validateField(field, 'jon doe');

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field must be a valid email.');
      });

    });


    describe('phone number pattern', function() {

      it('should be valid', function() {

        // given
        const field = {
          validate: {
            validationType: 'phone'
          }
        };

        // when
        const errors = validator.validateField(field, '+4930664040900');

        // then
        expect(errors).to.have.length(0);
      });


      it('should be invalid', function() {

        // given
        const field = {
          validate: {
            validationType: 'phone'
          }
        };

        // when
        const errors = validator.validateField(field, '1234');

        // then
        expect(errors).to.have.length(1);
        expect(errors[ 0 ]).to.equal('Field must be a valid  international phone number. (e.g. +4930664040900)');
      });

    });

  });


  describe('minLength', function() {

    it('should be valid', function() {

      // given
      const field = {
        validate: {
          minLength: 5
        }
      };

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(0);
    });


    it('should be invalid', function() {

      // given
      const field = {
        validate: {
          minLength: 5
        }
      };

      // when
      const errors = validator.validateField(field, 'foo');

      // then
      expect(errors).to.have.length(1);
      expect(errors[ 0 ]).to.equal('Field must have minimum length of 5.');
    });

  });


  describe('maxLength', function() {

    it('should be valid', function() {

      // given
      const field = {
        validate: {
          maxLength: 5
        }
      };

      // when
      const errors = validator.validateField(field, 'foo');

      // then
      expect(errors).to.have.length(0);
    });


    it('should be invalid', function() {

      // given
      const field = {
        validate: {
          maxLength: 5
        }
      };

      // when
      const errors = validator.validateField(field, 'foobar');

      // then
      expect(errors).to.have.length(1);
      expect(errors[ 0 ]).to.equal('Field must have maximum length of 5.');
    });

  });

});