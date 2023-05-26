import { Fragment } from "preact";

export default (props) => {

  const {
    helpers
  } = props;

  const {
    Fill
  } = helpers;

  return (
    <Fragment>
      <div>This is rendering fine</div>
      <Fill slot="editor-palette__footer" group="test-injection"><div>Test</div></Fill>
    </Fragment>
  )
};