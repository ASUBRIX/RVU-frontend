import React, { useMemo, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const CourseReportsTable = ({ searchQuery }) => {
  const data = useMemo(
    () => [
      {
        courseName: 'React Complete Guide',
        instructor: 'John Doe',
        category: 'Web Development',
        enrolledStudents: '150',
        completionRate: '85%',
        revenue: '$15,000'
      },
      {
        courseName: 'Python for Beginners',
        instructor: 'Jane Smith',
        category: 'Programming',
        enrolledStudents: '200',
        completionRate: '78%',
        revenue: '$18,000'
      },
      {
        courseName: 'Machine Learning Basics',
        instructor: 'Mike Johnson',
        category: 'Data Science',
        enrolledStudents: '175',
        completionRate: '82%',
        revenue: '$20,000'
      },
      {
        courseName: 'JavaScript Masterclass',
        instructor: 'Sarah Wilson',
        category: 'Web Development',
        enrolledStudents: '220',
        completionRate: '90%',
        revenue: '$22,000'
      }
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Course Name',
        accessor: 'courseName',
      },
      {
        Header: 'Instructor',
        accessor: 'instructor',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Enrolled Students',
        accessor: 'enrolledStudents',
      },
      {
        Header: 'Completion Rate',
        accessor: 'completionRate',
      },
      {
        Header: 'Revenue',
        accessor: 'revenue',
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setGlobalFilter(searchQuery || '');
  }, [searchQuery, setGlobalFilter]);

  return (
    <Card className="shadow-sm border-0 mt-5">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="table table-dark-gray align-middle mb-0" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th 
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="py-3 px-4 text-nowrap"
                    >
                      <div className="d-flex align-items-center">
                        {column.render('Header')}
                        <span className="ms-1">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown className="text-muted" />
                            ) : (
                              <FaSortUp className="text-muted" />
                            )
                          ) : (
                            <FaSort className="text-muted opacity-50" />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="py-3 px-4">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top">
          <div>
            <span className="me-2">Show</span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="form-select form-select-sm d-inline-block w-auto"
            >
              {[5, 10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ms-2">entries</span>
          </div>
          <div className="pagination mb-0">
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </button>
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </button>
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseReportsTable;
