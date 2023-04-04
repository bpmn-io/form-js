import { isNil } from 'min-dash';
import { countDecimals } from '../render/components/util/numberFieldUtil';
import Big from 'big.js';

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_PATTERN = /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/;

export default class Validator {

  validateField(field, value) {

    const { type, validate } = field;

    let errors = [];

    if (type === 'number') {

      const { decimalDigits, increment } = field;

      if (value === 'NaN') {

        errors = [
          ...errors,
          'Value is not a number.'
        ];

      }
      else if (value) {

        if (decimalDigits >= 0 && countDecimals(value) > decimalDigits) {
          errors = [
            ...errors,
            'Value is expected to ' +
            (decimalDigits === 0
              ? 'be an integer'
              : `have at most ${decimalDigits} decimal digit${decimalDigits > 1 ? 's' : ''}`
            ) + '.'
          ];
        }

        if (increment) {

          const bigValue = Big(value);
          const bigIncrement = Big(increment);

          const offset = bigValue.mod(bigIncrement);

          if (offset.cmp(0) !== 0) {
            const previousValue = bigValue.minus(offset);
            const nextValue = previousValue.plus(bigIncrement);

            errors = [
              ...errors,
              `Please select a valid value, the two nearest valid values are ${previousValue} and ${nextValue}.`
            ];
          }
        }
      }
    }

    if (!validate) {
      return errors;
    }

    if (validate.pattern && value && !new RegExp(validate.pattern).test(value)) {
      errors = [
        ...errors,
        `Field must match pattern ${ validate.pattern }.`
      ];
    }

    if (validate.required) {
      const isUncheckedCheckbox = type === 'checkbox' && value === false;
      const isUnsetValue = isNil(value) || value === '';
      const isEmptyMultiselect = Array.isArray(value) && value.length === 0;

      if (isUncheckedCheckbox || isUnsetValue || isEmptyMultiselect) {
        errors = [
          ...errors,
          'Field is required.'
        ];
      }
    }

    if ('min' in validate && (value || value === 0) && value < validate.min) {
      errors = [
        ...errors,
        `Field must have minimum value of ${ validate.min }.`
      ];
    }

    if ('max' in validate && (value || value === 0) && value > validate.max) {
      errors = [
        ...errors,
        `Field must have maximum value of ${ validate.max }.`
      ];
    }

    if ('minLength' in validate && value && value.trim().length < validate.minLength) {
      errors = [
        ...errors,
        `Field must have minimum length of ${ validate.minLength }.`
      ];
    }

    if ('maxLength' in validate && value && value.trim().length > validate.maxLength) {
      errors = [
        ...errors,
        `Field must have maximum length of ${ validate.maxLength }.`
      ];
    }

    if ('validationType' in validate && value && validate.validationType === 'phone' && !PHONE_PATTERN.test(value)) {
      errors = [
        ...errors,
        'Field must be a valid  international phone number. (e.g. +4930664040900)'
      ];
    }

    if ('validationType' in validate && value && validate.validationType === 'email' && !EMAIL_PATTERN.test(value)) {
      errors = [
        ...errors,
        'Field must be a valid email.'
      ];
    }

    return errors;
  }
}

Validator.$inject = [];