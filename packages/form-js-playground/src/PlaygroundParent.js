import fileDrop from 'file-drops';

import Playground from './Playground';

import './PlaygroundParent.css';
import './FileDrop.css';


export default function PlaygroundParent(options) {

  const {
    container,
    schema,
    data
  } = options;

  const parentElement = document.createElement('div');

  parentElement.classList.add('playground-parent');

  container.appendChild(parentElement);

  const playground = new Playground({
    container,
    schema,
    data
  });

  const handleDrop = fileDrop('Drop a form file', function(files) {
    const file = files[0];

    if (file) {
      try {
        playground.setSchema(JSON.parse(file.contents));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    }
  });

  container.addEventListener('dragover', handleDrop);

  playground.on('destroy', function() {
    container.removeChild(parentElement);
  });

  return playground;
}