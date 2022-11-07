import classNames from 'classnames';

export default function InputAdorner(props) {

  const {
    pre = null,
    post = null,
    rootRef,
    inputRef,
    children,
    disabled,
    hasErrors,
    onPreClick = () => inputRef?.current?.focus(),
    onPostClick = () => inputRef?.current?.focus()
  } = props;

  return <div class={ classNames('fjs-input-group', { 'disabled': disabled }, { 'hasErrors': hasErrors }) } ref={ rootRef }>
    { pre !== null && <span class="fjs-input-adornment border-right border-radius-left" onClick={ onPreClick }> { pre } </span> }
    { children }
    { post !== null && <span class="fjs-input-adornment border-left border-radius-right" onClick={ onPostClick }> { post } </span> }
  </div>;

}