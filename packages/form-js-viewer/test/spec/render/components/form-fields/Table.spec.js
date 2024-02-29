import { fireEvent, render } from '@testing-library/preact/pure';

import { Table } from '../../../../../src/render/components/form-fields/Table';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;


describe('Table', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createTable({
      field: {
        ...defaultField,
        columns: MOCK_COLUMNS
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-table')).to.be.true;

    expect(container.querySelector('table')).to.exist;
  });


  it('should show an empty message for no static columns', function() {

    // when
    const { container } = createTable();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-table')).to.be.true;

    expect(container.querySelector('table')).not.to.exist;
    expect(container.querySelector('.fjs-table-empty').textContent).to.eql('Nothing to show.');
  });


  it('should show an empty message for no dynamic columns', function() {

    const { columns:_, ...field } = defaultField;

    // when
    const { container } = createTable({
      initialData: {
        foo:[]
      },
      field: {
        ...field,
        columnsExpression: '=foo'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-table')).to.be.true;

    expect(container.querySelector('table')).not.to.exist;
    expect(container.querySelector('.fjs-table-empty').textContent).to.eql('Nothing to show.');
  });


  it('should show an empty message for no data', function() {

    // when
    const { container } = createTable({
      field: {
        ...defaultField,
        columns: MOCK_COLUMNS
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-table')).to.be.true;

    expect(container.querySelector('table')).to.exist;
    expect(container.querySelectorAll('.fjs-table-td')).to.have.length(1);
    expect(container.querySelector('.fjs-table-td').textContent).to.eql('Nothing to show.');
  });


  it('should render table rows', function() {

    // when
    const DATA = [
      {
        id: 1,
        name: 'foo',
        date: '2020-01-01'
      },
      {
        id: 2,
        name: 'bar',
        date: '2020-01-02'
      }
    ];

    const { container } = createTable({
      initialData: {
        data: DATA
      },
      field: {
        ...defaultField,
        columns: MOCK_COLUMNS,
        dataSource: '=data'
      },
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => DATA
        }
      }
    });

    // then
    const headers = container.querySelectorAll('.fjs-table-th');
    expect(headers).to.have.length(3);

    const [ idHeader, nameHeader, dateHeader ] = headers;

    expect(idHeader.textContent).to.eql('ID');
    expect(nameHeader.textContent).to.eql('Name');
    expect(dateHeader.textContent).to.eql('Date');

    const bodyRows = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(bodyRows).to.have.length(2);

    const [ firstRow, secondRow ] = bodyRows;

    expect(firstRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(firstRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('1');
    expect(firstRow.querySelectorAll('.fjs-table-td')[1].textContent).to.eql('foo');
    expect(firstRow.querySelectorAll('.fjs-table-td')[2].textContent).to.eql('2020-01-01');

    expect(secondRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(secondRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('2');
    expect(secondRow.querySelectorAll('.fjs-table-td')[1].textContent).to.eql('bar');
    expect(secondRow.querySelectorAll('.fjs-table-td')[2].textContent).to.eql('2020-01-02');
  });


  it('should have pagination', function() {

    // when
    const DATA = [
      {
        id: 1,
        name: 'foo',
        date: '2020-01-01'
      },
      {
        id: 2,
        name: 'bar',
        date: '2020-01-02'
      }
    ];
    const { container } = createTable({
      initialData: {
        data: DATA
      },
      field: {
        ...defaultField,
        columns: MOCK_COLUMNS,
        dataSource: '=data',
        rowCount: 1
      },
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => DATA
        }
      }
    });

    // then
    expect(container.querySelector('.fjs-table-nav-label')).to.exist;
    expect(container.querySelector('.fjs-table-nav-label').textContent).to.eql('1 of 2');

    expect(container.querySelector('.fjs-table-nav-button[aria-label="Previous page"]')).to.exist;
    expect(container.querySelector('.fjs-table-nav-button[aria-label="Previous page"]').disabled).to.be.true;

    expect(container.querySelector('.fjs-table-nav-button[aria-label="Next page"]')).to.exist;
    expect(container.querySelector('.fjs-table-nav-button[aria-label="Next page"]').disabled).to.be.false;

    const firstPageRow = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(firstPageRow).to.have.length(1);

    const [ firstRow ] = firstPageRow;

    expect(firstRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(firstRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('1');
    expect(firstRow.querySelectorAll('.fjs-table-td')[1].textContent).to.eql('foo');
    expect(firstRow.querySelectorAll('.fjs-table-td')[2].textContent).to.eql('2020-01-01');

    fireEvent.click(container.querySelector('.fjs-table-nav-button[aria-label="Next page"]'));

    expect(container.querySelector('.fjs-table-nav-label').textContent).to.eql('2 of 2');

    expect(container.querySelector('.fjs-table-nav-button[aria-label="Previous page"]')).to.exist;
    expect(container.querySelector('.fjs-table-nav-button[aria-label="Previous page"]').disabled).to.be.false;

    expect(container.querySelector('.fjs-table-nav-button[aria-label="Next page"]')).to.exist;
    expect(container.querySelector('.fjs-table-nav-button[aria-label="Next page"]').disabled).to.be.true;

    const secondPageRow = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(secondPageRow).to.have.length(1);

    const [ secondRow ] = secondPageRow;

    expect(secondRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(secondRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('2');
    expect(secondRow.querySelectorAll('.fjs-table-td')[1].textContent).to.eql('bar');
    expect(secondRow.querySelectorAll('.fjs-table-td')[2].textContent).to.eql('2020-01-02');
  });


  it('should sort rows', function() {

    // when
    const DATA = [
      {
        id: 1,
        name: 'foo',
        date: '2020-01-01'
      },
      {
        id: 2,
        name: 'bar',
        date: '2020-01-02'
      }
    ];
    const { container } = createTable({
      initialData: {
        data: DATA
      },
      field: {
        ...defaultField,
        columns: MOCK_COLUMNS,
        dataSource: '=data',
        rowCount: 1
      },
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => DATA
        }
      }
    });

    // then
    const unsortedRows = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(unsortedRows).to.have.length(1);

    const [ firstRow ] = unsortedRows;

    expect(firstRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('1');

    const headers = container.querySelectorAll('.fjs-table-th');
    expect(headers).to.have.length(3);

    fireEvent.click(headers[0]);

    expect(container.querySelector('.fjs-table-sort-icon-asc')).to.exist;

    const rowsSortedAsc = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(rowsSortedAsc).to.have.length(1);

    const [ secondRow ] = rowsSortedAsc;

    expect(secondRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(secondRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('1');

    fireEvent.click(headers[0]);

    expect(container.querySelector('.fjs-table-sort-icon-asc')).not.to.exist;
    expect(container.querySelector('.fjs-table-sort-icon-desc')).to.exist;

    const rowsSortedDesc = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(rowsSortedDesc).to.have.length(1);

    const [ thirdRow ] = rowsSortedDesc;

    expect(thirdRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(thirdRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('2');

    fireEvent.click(headers[0]);

    expect(container.querySelector('.fjs-table-sort-icon-asc')).not.to.exist;
    expect(container.querySelector('.fjs-table-sort-icon-desc')).not.to.exist;

    const finalUnsortedRows = container.querySelectorAll('.fjs-table-body .fjs-table-tr');

    expect(finalUnsortedRows).to.have.length(1);

    const [ fourthRow ] = finalUnsortedRows;

    expect(fourthRow.querySelectorAll('.fjs-table-td')).to.have.length(3);
    expect(fourthRow.querySelectorAll('.fjs-table-td')[0].textContent).to.eql('1');
  });


  it('should render table label', function() {

    // when
    const label = 'foo';

    const { container } = createTable({
      field: {
        ...defaultField,
        label
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const tableLabel = formField.querySelector('.fjs-form-field-label');

    expect(tableLabel).to.exist;
    expect(tableLabel.textContent).to.eql(label);
  });


  it('should render table title (expression)', function() {

    // when
    const label = 'foo';

    const { container } = createTable({
      initialData: {
        label
      },
      field: {
        ...defaultField,
        label: '=label'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const tableLabel = formField.querySelector('.fjs-form-field-label');

    expect(tableLabel).to.exist;
    expect(tableLabel.textContent).to.eql(label);
  });


  it('should render table label (template)', function() {

    // when
    const label = 'foo';

    const { container } = createTable({
      initialData: {
        label
      },
      field: {
        ...defaultField,
        label: '{{ label }}'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const tableLabel = formField.querySelector('.fjs-form-field-label');

    expect(tableLabel).to.exist;
    expect(tableLabel.textContent).to.eql(label);
  });


  it('#create', function() {

    // assume
    const { config } = Table;
    expect(config.type).to.eql('table');
    expect(config.label).to.eql('Table');
    expect(config.group).to.eql('presentation');
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    // then
    expect(field).to.exist;

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createTable();

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const MOCK_COLUMNS = [
  {
    label: 'ID',
    key: 'id'
  },
  {
    label: 'Name',
    key: 'name'
  },
  {
    label: 'Date',
    key: 'date'
  }
];

const defaultField = {
  label: 'A table',
  columns: [],
  dataSource: '=foo',
  type: 'table'
};

function createTable({ services, ...restOptions } = {}) {

  const options = {
    field: defaultField,
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Table
        field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}