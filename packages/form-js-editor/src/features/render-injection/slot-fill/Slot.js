import { Fragment } from 'preact';
import { useContext, useMemo } from 'preact/hooks';
import SlotContext from './SlotContext';

/**
 * Functional component for rendering slot fills.
 *
 * @param {Object} props Component properties
 * @param {string} props.name Slot name
 * @param {Function} props.fillRoot Function for creating a fill root element
 * @param {Function} props.groupFn Function for grouping slot fills
 * @param {Function} props.separatorFn Function for creating separator elements between groups
 * @param {number} props.limit Limit on the number of slot fills to render
 * @returns {Array} Array of rendered slot fills, grouped and separated as specified
 */
export default (props) => {
  const {
    name,
    fillRoot = FillFragment,
    groupFn = _groupByGroupName,
    separatorFn = (key) => null,
    limit
  } = props;

  const { fills } = useContext(SlotContext);

  const filtered = useMemo(() => fills.filter(fill => fill.slot === name), [ fills, name ]);

  const cropped = useMemo(() => limit ? filtered.slice(0, limit) : filtered, [ filtered, limit ]);

  const groups = useMemo(() => groupFn(cropped), [ cropped , groupFn ]);

  const fillsAndSeparators = useMemo(() => {
    return buildFills(groups, fillRoot, separatorFn);
  }, [ groups, fillRoot, separatorFn ]);

  return fillsAndSeparators;
};

/**
 * Creates a Fragment for a fill.
 *
 * @param {Object} fill Fill to be rendered
 * @returns {Object} Preact Fragment containing fill's children
 */
const FillFragment = (fill) => <Fragment key={ fill.id }>{fill.children}</Fragment>;

/**
 * Creates an array of fills, with separators inserted between groups.
 *
 * @param {Array} groups Groups of fills
 * @param {Function} fillRenderer Function to create a fill
 * @param {Function} separatorRenderer Function to create a separator
 * @returns {Array} Array of fills and separators
 */
const buildFills = (groups, fillRenderer, separatorRenderer) => {

  const result = [];

  groups.forEach((array, idx) => {

    if (idx !== 0) {
      const separator = separatorRenderer(`__separator_${idx}`);

      if (separator) {
        result.push(separator);
      }
    }

    array.forEach((fill) => {
      result.push(fillRenderer(fill));
    });
  });

  return result;
};

/**
 * Groups fills by group name property.
 */
const _groupByGroupName = (fills) => {

  const groups = [];

  const groupsById = {};

  fills.forEach(function(fill) {

    const {
      group: groupName = 'z_default'
    } = fill;

    let group = groupsById[groupName];

    if (!group) {
      groupsById[groupName] = group = [];
      groups.push(group);
    }

    group.push(fill);
  });

  groups.forEach(group => group.sort(_comparePriority));

  return Object.keys(groupsById)
    .sort()
    .map(id => groupsById[id]);
};

/**
 * Compares fills by priority.
 */
const _comparePriority = (a, b) => {
  return (b.priority || 0) - (a.priority || 0);
};