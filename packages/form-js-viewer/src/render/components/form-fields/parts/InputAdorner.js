import classNames from 'classnames';

export default function InputAdorner(props) {

  const {
    pre = null,
    post = null,
    rootRef,
    inputRef,
    children,
    disabled,
    readonly,
    hasErrors
  } = props;

  const onAdornmentClick = () => inputRef?.current?.focus();

  return <div class={ classNames('fjs-input-group', { 'disabled': disabled, 'readonly': readonly }, { 'hasErrors': hasErrors }) } ref={ rootRef }>
    { pre !== null && <span class="fjs-input-adornment border-right border-radius-left" onClick={ onAdornmentClick }> { pre } </span> }
    { children }
    { post !== null && <span class="fjs-input-adornment border-left border-radius-right" onClick={ onAdornmentClick }> { post } </span> }
  </div>;

}