import { createContext } from 'preact';

const FormRenderContext = createContext({
  EmptyRoot: (props) => {
    return null;
  },
  Empty: (props) => {
    return null;
  },
  Children: (props) => {
    return <div class={ props.class } style={ props.style }>{ props.children }</div>;
  },
  Element: (props) => {
    return <div class={ props.class } style={ props.style }>{ props.children }</div>;
  },
  Row: (props) => {
    return <div class={ props.class } style={ props.style }>{ props.children }</div>;
  },
  Column: (props) => {
    if (props.field.type === 'default') {
      return props.children;
    }

    return <div class={ props.class } style={ props.style }>{ props.children }</div>;
  },
  hoveredId: [],
  setHoveredId: (newValue) => { console.log(`setHoveredId not defined, called with '${newValue}'`); }
});

export default FormRenderContext;