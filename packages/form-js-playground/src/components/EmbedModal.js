import { useEffect, useRef } from 'preact/hooks';

import { Modal } from './Modal';


export function EmbedModal(props) {

  const schema = serializeValue(props.schema);
  const data = serializeValue(props.data || {});

  const fieldRef = useRef();

  const snippet = `<!-- styles needed for rendering -->
<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/assets/form-js.css">

<!-- container to render the form into -->
<div class="fjs-pgl-form-container"></div>

<!-- scripts needed for embedding -->
<script src="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/form-viewer.umd.js"></script>

<!-- actual script to instantiate the form and load form schema + data -->
<script>
  const data = JSON.parse(${data});
  const schema = JSON.parse(${schema});

  const form = new FormViewer.Form({
    container: document.querySelector(".fjs-pgl-form-container")
  });

  form.on("submit", (event) => {
    console.log(event.data, event.errors);
  });

  form.importSchema(schema, data).catch(err => {
    console.error("Failed to render form", err);
  });
</script>
  `.trim();

  useEffect(() => {
    fieldRef.current.select();
  });

  return (
    <Modal name="Embed form" onClose={ props.onClose }>
      <p>Use the following HTML snippet to embed your form with <a href="https://github.com/bpmn-io/form-js">form-js</a>:</p>

      <textarea spellCheck="false" ref={ fieldRef }>{snippet}</textarea>
    </Modal>
  );
}


// helpers ///////////

function serializeValue(obj) {
  return JSON.stringify(JSON.stringify(obj)).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}