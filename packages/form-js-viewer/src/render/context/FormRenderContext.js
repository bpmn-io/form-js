import { createContext } from 'preact';

const FormRenderContext = createContext({
  Empty: (props) => {
    return null;
  },
  Children: (props) => {
    return <div class={ props.class }>{ props.children }</div>;
  },
  Element: (props) => {
    return <div class={ props.class }>{ props.children }</div>;
  },
  Row: (props) => {
    return <div class={ props.class }>{ props.children }</div>;
  },
  Column: (props) => {
    if (props.field.type === 'default') {
      return props.children;
    }

    return <div class={ props.class }>{ props.children }</div>;
  }
});

export default FormRenderContext;