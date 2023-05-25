import { useContext, useEffect } from 'preact/hooks';

import FillContext from './FillContext';
import { PureComponent } from 'preact/compat';

export default (props) => {
  const context = useContext(FillContext);

  return (
    <ActualFill { ...props } fillContext={ context } />
  );
};

// export const ActualFill = (props) => {
//   const { fillContext } = props;

//   useEffect(() => {
//     const deregister = () => {
//       fillContext.removeFill(this);
//     };

//     const register = () => {
//       fillContext.addFill(this);
//     };

//     register();

//     return () => {
//       deregister();
//     };
//   }, [ fillContext ]);

//   return null;
// };

export class ActualFill extends PureComponent {

  componentWillUnmount() {
    this._deregister();
  }

  componentDidMount() {
    this._register();
  }

  componentDidUpdate() {
    this._register();
  }

  render() {
    return null;
  }

  _deregister() {
    const {
      fillContext
    } = this.props;

    fillContext.removeFill(this);
  }

  _register() {

    const {
      fillContext
    } = this.props;

    fillContext.addFill(this);
  }
}
