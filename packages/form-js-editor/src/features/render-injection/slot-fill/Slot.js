import { Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import SlotContext from './SlotContext';

/**
 * Functional component for rendering slot fills.
 *
 * @param {Object} props Component properties
 * @param {string} props.name Slot name
 * @param {Function} [props.group=groupFills] Function for grouping slot fills
 * @param {Function} [props.separator=(key) => null] Function for creating separator elements between groups
 * @param {number} [props.limit] Limit on the number of slot fills to render
 * @returns {Array} Array of rendered slot fills, grouped and separated as specified
 */
export default (props) => {
  const {
    name,
    group = groupFills,
    separator = (key) => null,
    limit
  } = props;

  const { fills } = useContext(SlotContext);

  const filtered = fills.filter(fill => {
    return fill.props.slot === name;
  });

  const cropped = limit ? filtered.slice(0, limit) : filtered;

  const grouped = group(cropped);

  return createFills(grouped, fillFragment, separator);
};

/**
 * Creates a Fragment for a fill.
 *
 * @param {Object} fill Fill to be rendered
 * @returns {Object} Preact Fragment containing fill's children
 */
const fillFragment = (fill) => {
  return <Fragment key={ fill.id }>{fill.props.children}</Fragment>;
};

/**
 * Creates an array of fills, with separators inserted between groups.
 *
 * @param {Array} arrays Arrays of fills
 * @param {Function} fillFn Function to create a fill
 * @param {Function} separatorFn Function to create a separator
 * @returns {Array} Array of fills and separators
 */
const createFills = (arrays, fillFn, separatorFn) => {

  const result = [];

  arrays.forEach((array, idx) => {

    if (idx !== 0) {
      const separator = separatorFn(`__separator_${idx}`);

      if (separator) {
        result.push(separator);
      }
    }

    array.forEach((fill) => {
      result.push(fillFn(fill));
    });
  });

  return result;
};

/**
 * Groups fills by group name property.
 *
 * @param {Array} fills Array of fills
 * @returns {Array} Array of grouped fills
 */
const groupFills = (fills) => {

  const groups = [];

  const groupsById = {};

  fills.forEach(function(fill) {

    const {
      group: groupName = 'z_default'
    } = fill.props;

    let group = groupsById[groupName];

    if (!group) {
      groupsById[groupName] = group = [];
      groups.push(group);
    }

    group.push(fill);
  });

  // sort within groups based on priority [default = 0]
  groups.forEach(group => group.sort(comparePriority));

  return Object.keys(groupsById)
    .sort()
    .map(id => groupsById[id]);
};

/**
 * Compares fills by priority.
 *
 * @param {Object} a First fill
 * @param {Object} b Second fill
 * @returns {number} Comparison result
 */
const comparePriority = (a, b) => {
  return (b.props.priority || 0) - (a.props.priority || 0);
};