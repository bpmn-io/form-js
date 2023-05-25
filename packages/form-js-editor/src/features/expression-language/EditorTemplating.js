import { isString } from 'min-dash';

export default class EditorTemplating {

  // same rules as viewer templating
  isTemplate(value) { return isString(value) && (value.startsWith('=') || /{{/.test(value)); }

  // return the template raw, as we usually just want to display that
  evaluate(template) { return template; }
}

EditorTemplating.$inject = [];
