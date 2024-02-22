import { get } from 'min-dash';
import { SECURITY_ATTRIBUTES_DEFINITIONS, SANDBOX_ATTRIBUTE } from '../../util/constants';
import { useMemo } from 'preact/hooks';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';

/**
 * A custom hook to build up security attributes from form configuration.
 *
 * @param {Object} security - The security configuration.
 * @returns {Array} - Returns a tuple with sandbox and allow attributes.
 */
export function useSecurityAttributesMap(security) {

  const securityMemoized = useDeepCompareMemoize(security);

  const sandbox = useMemo(() =>
    SECURITY_ATTRIBUTES_DEFINITIONS
      .filter(({ attribute }) => attribute === SANDBOX_ATTRIBUTE)
      .filter(({ property }) => get(securityMemoized, [ property ], false))
      .map(({ directive }) => directive)
      .join(' ')
  , [ securityMemoized ]);

  const allow = useMemo(() =>
    SECURITY_ATTRIBUTES_DEFINITIONS
      .filter(({ attribute }) => attribute !== SANDBOX_ATTRIBUTE)
      .filter(({ property }) => get(securityMemoized, [ property ], false))
      .map(({ directive }) => directive)
      .join('; ')
  , [ securityMemoized ]);

  return [ sandbox, allow ];
}
