import { useEffect } from 'preact/hooks';

export function Modal(props) {

  useEffect(() => {
    function handleKey(event) {

      if (event.key === 'Escape') {
        event.stopPropagation();

        props.onClose();
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  });

  return (
    <div class="fjs-pgl-modal">
      <div class="fjs-pgl-modal-backdrop" onClick={ props.onClose }></div>
      <div class="fjs-pgl-modal-content">
        <h1 class="fjs-pgl-modal-header">{ props.name }</h1>
        <div class="fjs-pgl-modal-body">
          { props.children }
        </div>
        <div class="fjs-pgl-modal-footer">
          <button class="fjs-pgl-button fjs-pgl-button-default" onClick={ props.onClose }>Close</button>
        </div>
      </div>
    </div>
  );
}
