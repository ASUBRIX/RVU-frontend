import React, { useEffect, useMemo } from 'react'
import { Card, Table } from 'react-bootstrap'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'

const PaymentReportsTable = ({ searchQuery }) => {
  // Sample data for payment reports
  const data = useMemo(
    () => [
      {
        id: 'ORD-2023-0001',
        course: 'Advanced JavaScript Course',
        student: 'John Smith',
        phone: '+1 (555) 123-4567',
        amount: '$89.99',
        gross: '$89.99',
        platformFee: '$8.99',
        net: '$81.00',
      },
      {
        id: 'ORD-2023-0002',
        course: 'React Development Masterclass',
        student: 'Emily Johnson',
        phone: '+1 (555) 234-5678',
        amount: '$94.99',
        gross: '$94.99',
        platformFee: '$9.50',
        net: '$85.49',
      },
      {
        id: 'ORD-2023-0003',
        course: 'Python for Data Science',
        student: 'Michael Brown',
        phone: '+1 (555) 345-6789',
        amount: '$79.99',
        gross: '$79.99',
        platformFee: '$8.00',
        net: '$71.99',
      },
      {
        id: 'ORD-2023-0004',
        course: 'Complete Web Development Bootcamp',
        student: 'Jessica Williams',
        phone: '+1 (555) 456-7890',
        amount: '$129.99',
        gross: '$129.99',
        platformFee: '$13.00',
        net: '$116.99',
      },
      {
        id: 'ORD-2023-0005',
        course: 'Mobile App Development with Flutter',
        student: 'David Miller',
        phone: '+1 (555) 567-8901',
        amount: '$74.99',
        gross: '$74.99',
        platformFee: '$7.50',
        net: '$67.49',
      },
      {
        id: 'ORD-2023-0006',
        course: 'SQL Database Design',
        student: 'Sarah Davis',
        phone: '+1 (555) 678-9012',
        amount: '$59.99',
        gross: '$59.99',
        platformFee: '$6.00',
        net: '$53.99',
      },
      {
        id: 'ORD-2023-0007',
        course: 'AWS Certification Course',
        student: 'James Wilson',
        phone: '+1 (555) 789-0123',
        amount: '$119.99',
        gross: '$119.99',
        platformFee: '$12.00',
        net: '$107.99',
      },
      {
        id: 'ORD-2023-0008',
        course: 'Machine Learning Fundamentals',
        student: 'Lisa Thomas',
        phone: '+1 (555) 890-1234',
        amount: '$99.99',
        gross: '$99.99',
        platformFee: '$10.00',
        net: '$89.99',
      },
      {
        id: 'ORD-2023-0009',
        course: 'Advanced JavaScript Course',
        student: 'Ryan Garcia',
        phone: '+1 (555) 901-2345',
        amount: '$89.99',
        gross: '$89.99',
        platformFee: '$8.99',
        net: '$81.00',
      },
      {
        id: 'ORD-2023-0010',
        course: 'React Development Masterclass',
        student: 'Amanda Clark',
        phone: '+1 (555) 012-3456',
        amount: '$94.99',
        gross: '$94.99',
        platformFee: '$9.50',
        net: '$85.49',
      },
    ],
    [],
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'id',
      },
      {
        Header: 'Student Name',
        accessor: 'student',
      },
      {
        Header: 'Course',
        accessor: 'course',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Gross',
        accessor: 'gross',
      },
      {
        Header: 'Platform Fee',
        accessor: 'platformFee',
      },
      {
        Header: 'Net',
        accessor: 'net',
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
    setGlobalFilter,
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

  useEffect(() => {
    setGlobalFilter(searchQuery || '')
  }, [searchQuery, setGlobalFilter])

  return (
    <Card className="shadow-sm border-0 mt-5">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="table table-dark-gray align-middle mb-0" {...getTableProps()}>
            <thead>
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
          </Table>
        </div>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top">
          <div>
            <span className="me-2">Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="form-select form-select-sm d-inline-block w-auto">
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ms-2">entries</span>
          </div>
          <div className="pagination mb-0">
            <button className="btn btn-sm btn-light me-2" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>
            <button className="btn btn-sm btn-light me-2" onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>
            <button className="btn btn-sm btn-light me-2" onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>
            <button className="btn btn-sm btn-light" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PaymentReportsTable
