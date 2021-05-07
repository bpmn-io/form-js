import ButtonRenderer from './ButtonRenderer';
import CheckboxRenderer from './CheckboxRenderer';

// import ColumnsRenderer from './ColumnsRenderer';
import DefaultRenderer from './DefaultRenderer';

// import NumberRenderer from './NumberRenderer';
import RadioRenderer from './RadioRenderer';
import SelectRenderer from './SelectRenderer';
import TextRenderer from './TextRenderer';
import TextfieldRenderer from './TextfieldRenderer';

export { default as ButtonRenderer } from './ButtonRenderer';
export { default as CheckboxRenderer } from './CheckboxRenderer';

// export { default as ColumnsRenderer } from './ColumnsRenderer';
export { default as DefaultRenderer } from './DefaultRenderer';

// export { default as NumberRenderer } from './NumberRenderer';
export { default as RadioRenderer } from './RadioRenderer';
export { default as SelectRenderer } from './SelectRenderer';
export { default as TextRenderer } from './TextRenderer';
export { default as TextfieldRenderer } from './TextfieldRenderer';

export const fields = [
  ButtonRenderer,
  CheckboxRenderer,

  // ColumnsRenderer,
  DefaultRenderer,

  // NumberRenderer,
  RadioRenderer,
  SelectRenderer,
  TextRenderer,
  TextfieldRenderer
];

// export { createRenderer } from './CustomRenderer';