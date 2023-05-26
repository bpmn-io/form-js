import { Fragment } from 'preact';

import { useContext } from 'preact/hooks';

import FillContext from '../slot-fill/FillContext';


export default (props) => {

  const {
    helpers
  } = props;

  const {
    Fill
  } = helpers;

  const fillContext = useContext(FillContext);
  console.log('rerender injected component', fillContext);
  debugger;

  return (
    <Fragment>
      <div>This is rendering fine</div>
      <Fill slot="editor-palette__footer" group="test-injection"><div>Test</div></Fill>
    </Fragment>
  );
};