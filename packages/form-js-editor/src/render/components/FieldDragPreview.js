import classNames from 'classnames';

export function FieldDragPreview(props) {
  const {
    class: className,
    Icon,
    label
  } = props;

  return (
    <div class={ classNames('fjs-field-preview', className) }>
      <Icon class="fjs-field-preview-icon" width="36" height="36" viewBox="0 0 54 54" />
      <span class="fjs-field-preview-text">{ label }</span>
    </div>
  );
}