import classNames from 'classnames';

import { useCallback } from 'preact/hooks';

export function SkipLink(props) {

  const {
    className,
    label,
    onSkip
  } = props;

  const onKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onSkip();
    }
  }, [ onSkip ]);


  return (
    <a
      href="#"
      class={ classNames('fjs-skip-link', className) }
      onKeyDown={ onKeyDown }
    >{ label }</a>
  );
}