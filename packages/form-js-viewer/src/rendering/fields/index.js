import ButtonRenderer from './ButtonRenderer';

// import ColumnsRenderer from './ColumnsRenderer';
import DefaultRenderer from './DefaultRenderer';

// import NumberRenderer from './NumberRenderer';
import TextfieldRenderer from './TextfieldRenderer';

export { default as ButtonRenderer } from './ButtonRenderer';

// export { default as ColumnsRenderer } from './ColumnsRenderer';
export { default as DefaultRenderer } from './DefaultRenderer';

// export { default as NumberRenderer } from './NumberRenderer';
export { default as TextfieldRenderer } from './TextfieldRenderer';

export const fields = [
  ButtonRenderer,

  // ColumnsRenderer,
  DefaultRenderer,

  // NumberRenderer,
  TextfieldRenderer
];

// export { createRenderer } from './CustomRenderer';