import classNames from 'classnames';
import { isString } from 'min-dash';

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

  const onAdornmentClick = () => inputRef && inputRef.current && inputRef.current.focus();

  return <div class={ classNames('fjs-input-group', { 'fjs-disabled': disabled, 'fjs-readonly': readonly }, { 'hasErrors': hasErrors }) } ref={ rootRef }>
    { pre !== null && <span class="fjs-input-adornment border-right border-radius-left" onClick={ onAdornmentClick }> { isString(pre) ? <span class="fjs-input-adornment-text">{ pre }</span> : pre } </span> }
    { children }
    { post !== null && <span class="fjs-input-adornment border-left border-radius-right" onClick={ onAdornmentClick }> { isString(post) ? <span class="fjs-input-adornment-text">{ post }</span> : post } </span> }
  </div>;

}