export default (props) => {

    const {
      helpers
    } = props;
  
    const {
      Fill
    } = helpers;
  
    return <Fill slot="editor-palette__footer" group="test-injection"><div>Test</div></Fill>
};