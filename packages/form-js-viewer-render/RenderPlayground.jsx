import { foo } from './src/index.js';
import { Fragment } from 'preact';

const RenderPlayground = () => {
  return <Fragment>{foo()}</Fragment>;
};

export { RenderPlayground };
