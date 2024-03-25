import { isDefined, isNumber, isObject, isString } from 'min-dash';
import { useExpressionEvaluation } from '../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { formFieldClasses, prefixId } from '../Util';
import classNames from 'classnames';

import { Label } from '../Label';
import ArrowDownIcon from './icons/ArrowDown.svg';
import ArrowUpIcon from './icons/ArrowUp.svg';
import CaretLeftIcon from './icons/CaretLeft.svg';
import CaretRightIcon from './icons/CaretRight.svg';

const type = 'table';

/**
 * @typedef {('asc'|'desc')} Direction
 *
 * @typedef Sorting
 * @property {string} key
 * @property {Direction} direction
 *
 * @typedef Column
 * @property {string} label
 * @property {string} key
 *
 * @typedef Field
 * @property {string} id
 * @property {Array<Column>} [columns]
 * @property {string} [columnsExpression]
 * @property {string} [label]
 * @property {number} [rowCount]
 * @property {string} [dataSource]
 *
 * @typedef Props
 * @property {Field} field
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function Table(props) {
  const { field } = props;
  const {
    columns = [],
    columnsExpression,
    dataSource = '',
    rowCount,
    id,
    label,
  } = field;

  /** @type {[(null|Sorting), import("preact/hooks").StateUpdater<null|Sorting>]} */
  const [ sortBy, setSortBy ] = useState(null);
  const evaluatedColumns = useEvaluatedColumns(
    columnsExpression || '',
    columns,
  );
  const columnKeys = evaluatedColumns.map(({ key }) => key);
  const evaluatedDataSource = useExpressionEvaluation(dataSource);
  const data = Array.isArray(evaluatedDataSource) ? evaluatedDataSource.filter(i => i !== undefined) : [];
  const sortedData =
    sortBy === null
      ? data
      : sortByColumn(data, sortBy.key, sortBy.direction);

  /** @type {unknown[][]} */
  const chunkedData = isNumber(rowCount) ? chunk(sortedData, rowCount) : [ sortedData ];
  const [ currentPage, setCurrentPage ] = useState(0);
  const currentChunk = chunkedData[currentPage] || [];


  useEffect(() => {
    setCurrentPage(0);
  }, [ rowCount, sortBy ]);


  /** @param {string} key */
  function toggleSortBy(key) {
    setSortBy((current) => {
      if (current === null || current.key !== key) {
        return {
          key,
          direction: 'asc',
        };
      }

      if (current.direction === 'desc') {
        return null;
      }

      return {
        key,
        direction: 'desc',
      };
    });
  }

  return (
    <div class={ formFieldClasses(type) }>
      <Label htmlFor={ prefixId(id) } label={ label } />
      <div
        class={ classNames('fjs-table-middle-container', {
          'fjs-table-empty': evaluatedColumns.length === 0,
        }) }
      >
        {evaluatedColumns.length === 0 ? (
          'Nothing to show.'
        ) : (
          <div class="fjs-table-inner-container">
            <table class="fjs-table" id={ prefixId(id) }>
              <thead class="fjs-table-head">
                <tr class="fjs-table-tr">
                  {evaluatedColumns.map(({ key, label }) => {
                    const displayLabel = label || key;

                    return (
                      <th
                        key={ key }
                        tabIndex={ 0 }
                        class="fjs-table-th"
                        onClick={ () => {
                          toggleSortBy(key);
                        } }
                        onKeyDown={ (event) => {
                          if ([ 'Enter', 'Space' ].includes(event.code)) {
                            toggleSortBy(key);
                          }
                        } }
                        aria-label={ getHeaderAriaLabel(
                          sortBy,
                          key,
                          displayLabel,
                        ) }
                      >
                        <span
                          class="fjs-table-th-label"
                        >
                          {displayLabel}
                          {sortBy !== null && sortBy.key === key ? (
                            <>
                              {sortBy.direction === 'asc' ? (
                                <ArrowUpIcon class="fjs-table-sort-icon-asc" />
                              ) : (
                                <ArrowDownIcon class="fjs-table-sort-icon-desc" />
                              )}
                            </>
                          ) : null}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {currentChunk.length === 0 ? (
                <tbody class="fjs-table-body">
                  <tr class="fjs-table-tr">
                    <td class="fjs-table-td" colSpan={ evaluatedColumns.length }>
                      Nothing to show.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody class="fjs-table-body">
                  {currentChunk.map((row, index) => (
                    <tr key={ index } class="fjs-table-tr">
                      {columnKeys.map((key) => (
                        <td key={ key } class="fjs-table-td">
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}

        {(isNumber(rowCount) && chunkedData.length > 1 && evaluatedColumns.length > 0) ?
          (
            <nav class="fjs-table-nav">
              <span class="fjs-table-nav-label">
                {currentPage + 1} of {chunkedData.length}
              </span>
              <button
                type="button"
                class="fjs-table-nav-button"
                onClick={ () => {
                  setCurrentPage((page) => Math.max(page - 1, 0));
                } }
                disabled={ currentPage === 0 }
                aria-label="Previous page"
              >
                <CaretLeftIcon />
              </button>
              <button
                type="button"
                class="fjs-table-nav-button"
                onClick={ () => {
                  setCurrentPage((page) =>
                    Math.min(page + 1, chunkedData.length - 1),
                  );
                } }
                disabled={ currentPage >= chunkedData.length - 1 }
                aria-label="Next page"
              >
                <CaretRightIcon />
              </button>
            </nav>
          ) : null}
      </div>
    </div>
  );
}

Table.config = {
  type,
  keyed: false,
  label: 'Table',
  group: 'presentation',
  create: (options = {}) => {
    const {
      id,
      columnsExpression,
      columns,
      rowCount,
      ...remainingOptions
    } = options;

    if (isDefined(id) && isNumber(rowCount)) {
      remainingOptions['rowCount'] = rowCount;
    }

    if (isString(columnsExpression)) {
      return {
        ...remainingOptions,
        id,
        columnsExpression,
      };
    }

    if (Array.isArray(columns) && columns.every(isColumn)) {
      return {
        ...remainingOptions,
        id,
        columns,
      };
    }

    return {
      ...remainingOptions,
      rowCount: 10,
      columns: [
        {
          label: 'ID',
          key: 'id',
        },
        {
          label: 'Name',
          key: 'name',
        },
        {
          label: 'Date',
          key: 'date',
        },
      ],
    };
  },

  /**
   * @experimental
   *
   * A function that generates demo data for a new field on the form playground.
   * @param {Field} field
   */
  generateInitialDemoData: (field) => {
    const demoData = [
      { id: 1, name: 'John Doe', date: '31.01.2023' },
      { id: 2, name: 'Erika Muller', date: '20.02.2023' },
      { id: 3, name: 'Dominic Leaf', date: '11.03.2023' }
    ];
    const demoDataKeys = Object.keys(demoData[0]);
    const { columns, id, dataSource } = field;

    if (!Array.isArray(columns) || columns.length === 0 || dataSource !== `=${id}`) {
      return;
    }

    if (!columns.map(({ key })=>key).every(key => demoDataKeys.includes(key))) {
      return;
    }

    return demoData;
  }
};

// helpers /////////////////////////////

/**
 * @param {string|void} columnsExpression
 * @param {Column[]} fallbackColumns
 * @returns {Column[]}
 */
function useEvaluatedColumns(columnsExpression, fallbackColumns) {

  /** @type {Column[]|null} */
  const evaluation = useExpressionEvaluation(columnsExpression || '');

  return Array.isArray(evaluation) && evaluation.every(isColumn)
    ? evaluation
    : fallbackColumns;
}

/**
 * @param {any} column
 * @returns {column is Column}
 */
function isColumn(column) {
  return (
    isObject(column) && isString(column['label']) && isString(column['key'])
  );
}

/**
 * @param {Array} array
 * @param {number} size
 * @returns {Array}
 */
function chunk(array, size) {
  return array.reduce((chunks, item, index) => {
    if (index % size === 0) {
      chunks.push([ item ]);
    } else {
      chunks[chunks.length - 1].push(item);
    }

    return chunks;
  }, []);
}

/**
 * @param {unknown[]} array
 * @param {string} key
 * @param {Direction} direction
 * @returns {unknown[]}
 */
function sortByColumn(array, key, direction) {
  return [ ...array ].sort((a, b) => {
    if (!isObject(a) || !isObject(b)) {
      return 0;
    }

    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }

    return a[key] < b[key] ? 1 : -1;
  });
}

/**
 * @param {null|Sorting} sortBy
 * @param {string} key
 * @param {string} label
 */
function getHeaderAriaLabel(sortBy, key, label) {
  if (sortBy === null || sortBy.key !== key) {
    return `Click to sort by ${label} descending`;
  }

  if (sortBy.direction === 'asc') {
    return 'Click to remove sorting';
  }

  return `Click to sort by ${label} ascending`;
}
