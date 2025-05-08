import React, { useMemo, useState } from 'react'
import { Card, Form, InputGroup } from 'react-bootstrap'
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'

const PopularCoursesTable = () => {
  const [globalFilter, setGlobalFilter] = useState('')

  // Sample data for popular courses
  const data = useMemo(
    () => [
      {
        id: 1,
        name: 'Advanced JavaScript Course',
        created: '2023-05-15',
        price: '$89.99',
        purchases: 245,
        revenue: '$22,047.55',
      },
      {
        id: 2,
        name: 'React Development Masterclass',
        created: '2023-04-10',
        price: '$94.99',
        purchases: 189,
        revenue: '$17,953.11',
      },
      {
        id: 3,
        name: 'Python for Data Science',
        created: '2023-03-22',
        price: '$79.99',
        purchases: 302,
        revenue: '$24,156.98',
      },
      {
        id: 4,
        name: 'Complete Web Development Bootcamp',
        created: '2023-02-18',
        price: '$129.99',
        purchases: 156,
        revenue: '$20,278.44',
      },
      {
        id: 5,
        name: 'Mobile App Development with Flutter',
        created: '2023-06-05',
        price: '$74.99',
        purchases: 178,
        revenue: '$13,348.22',
      },
      {
        id: 6,
        name: 'SQL Database Design',
        created: '2023-04-30',
        price: '$59.99',
        purchases: 203,
        revenue: '$12,177.97',
      },
      {
        id: 7,
        name: 'AWS Certification Course',
        created: '2023-05-22',
        price: '$119.99',
        purchases: 142,
        revenue: '$17,038.58',
      },
      {
        id: 8,
        name: 'Machine Learning Fundamentals',
        created: '2023-03-10',
        price: '$99.99',
        purchases: 168,
        revenue: '$16,798.32',
      },
    ],
    [],
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Course Name',
        accessor: 'name',
      },
      {
        Header: 'Created Date',
        accessor: 'created',
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        },
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Purchases',
        accessor: 'purchases',
        Cell: ({ value }) => value.toLocaleString(),
      },
      {
        Header: 'Revenue Generated',
        accessor: 'revenue',
      },
    ],
    [],
  )

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
    setGlobalFilter: setTableGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleSearchChange = (e) => {
    const value = e.target.value || ''
    setGlobalFilter(value)
    setTableGlobalFilter(value)
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Popular Courses</h5>
          <InputGroup className="w-50">
            <InputGroup.Text className="bg-light border-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search courses..." className="border-0 bg-light" />
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" {...getTableProps()}>
            <thead className="bg-light">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-4 text-nowrap">
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
              {page.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="py-3 px-4">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0 py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="me-3">
              Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length} entries
            </span>
            <select
              className="form-select form-select-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
              style={{ width: '80px' }}>
              {[5, 10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => gotoPage(0)}>
                  First
                </button>
              </li>
              <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => previousPage()}>
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                const pageNum = pageIndex - 2 + i < 0 ? i : pageIndex - 2 + i >= pageCount ? pageCount - 5 + i : pageIndex - 2 + i
                if (pageNum < 0 || pageNum >= pageCount) return null
                return (
                  <li key={pageNum} className={`page-item ${pageIndex === pageNum ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => gotoPage(pageNum)}>
                      {pageNum + 1}
                    </button>
                  </li>
                )
              })}
              <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => nextPage()}>
                  Next
                </button>
              </li>
              <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => gotoPage(pageCount - 1)}>
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default PopularCoursesTable
