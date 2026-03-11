import { Fragment } from 'preact';
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { SlotContext } from './SlotContext';
import { FormEditorContext } from '../../../render/context';

/**
 * Functional component for rendering slot fills.
 *
 * @param {Object} props Component properties
 * @param {string} props.name Slot name
 * @param {Function} [props.fillRoot] Function for creating a fill root element
 * @param {Function} [props.groupFn] Function for grouping slot fills
 * @param {Function} [props.separatorFn] Function for creating separator elements between groups
 * @param {number} [props.limit] Limit on the number of slot fills to render
 * @returns {import('preact').VNode} Fragment containing rendered slot fills
 */
export const Slot = (props) => {
  const { name, fillRoot = FillFragment, groupFn = _groupByGroupName, separatorFn = (key) => null, limit } = props;

  const { fills } = useContext(SlotContext);

  const filtered = useMemo(() => fills.filter((fill) => fill.slot === name), [fills, name]);

  const cropped = useMemo(() => (limit ? filtered.slice(0, limit) : filtered), [filtered, limit]);

  const groups = useMemo(() => groupFn(cropped), [cropped, groupFn]);

  const fillsAndSeparators = useMemo(() => {
    return buildFills(groups, fillRoot, separatorFn);
  }, [groups, fillRoot, separatorFn]);

  // Framework-agnostic fills from SlotFillManager
  const editorContext = useContext(FormEditorContext);
  const slotFillManager = editorContext ? editorContext.getService('slotFillManager', false) : null;
  const eventBus = editorContext ? editorContext.getService('eventBus', false) : null;

  const [, setRevision] = useState(0);

  useEffect(() => {
    if (!eventBus) {
      return;
    }

    const onChange = () => setRevision((r) => r + 1);

    eventBus.on('slotFillManager.changed', onChange);

    return () => eventBus.off('slotFillManager.changed', onChange);
  }, [eventBus]);

  const managerFills = slotFillManager ? slotFillManager.getFills(name) : [];

  return (
    <Fragment>
      {fillsAndSeparators}
      {managerFills.map((fill) => (
        <FillContainer key={fill.fillId} fill={fill} />
      ))}
    </Fragment>
  );
};

/**
 * Creates a Fragment for a fill.
 *
 * @param {Object} fill Fill to be rendered
 * @returns {Object} Preact Fragment containing fill's children
 */
const FillFragment = (fill) => <Fragment key={fill.id}>{fill.children}</Fragment>;

/**
 * Mounts a single SlotFillManager fill's render callback into a DOM container.
 */
function FillContainer({ fill }) {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    cleanupRef.current = fill.render(container) || null;

    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      container.innerHTML = '';
    };
  }, [fill]);

  return <div ref={containerRef} data-slot-fill={fill.fillId} />;
}

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

  fills.forEach(function (fill) {
    const { group: groupName = 'z_default' } = fill;

    let group = groupsById[groupName];

    if (!group) {
      groupsById[groupName] = group = [];
      groups.push(group);
    }

    group.push(fill);
  });

  groups.forEach((group) => group.sort(_comparePriority));

  return Object.keys(groupsById)
    .sort()
    .map((id) => groupsById[id]);
};

/**
 * Compares fills by priority.
 */
const _comparePriority = (a, b) => {
  return (b.priority || 0) - (a.priority || 0);
};
