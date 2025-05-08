import PageMetaData from '@/components/PageMetaData'
import { useState, useEffect } from 'react'
import PaymentReportsHeader from '../components/PaymentReportsHeader'
import PaymentReportsTable from '../components/PaymentReportsTable'
import { PaymentSummaryTiles } from '../components/SummaryTiles'

const PaymentReports = () => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState(null)
  const [sortOption, setSortOption] = useState(null)

  // State for table data
  const [originalTableData, setOriginalTableData] = useState([])
  const [filteredTableData, setFilteredTableData] = useState([])

  // Fetch initial data (replace with your actual data fetching method)
  useEffect(() => {
    const fetchPaymentReports = async () => {
      try {
        // Replace this with your actual data fetching logic
        const response = await fetch('/api/payment-reports')
        const data = await response.json()
        setOriginalTableData(data)
        setFilteredTableData(data)
      } catch (error) {
        console.error('Failed to fetch payment reports:', error)
      }
    }

    fetchPaymentReports()
  }, [])

  // Date Filter Change Handler
  const handleDateFilterChange = (filterType, startDate, endDate) => {
    let filteredData = [...originalTableData]

    switch (filterType) {
      case 'last7days':
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= sevenDaysAgo
        })
        break

      case 'lastMonth':
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= oneMonthAgo
        })
        break

      case 'lastQuarter':
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= threeMonthsAgo
        })
        break

      case 'custom':
        if (startDate && endDate) {
          filteredData = filteredData.filter((item) => {
            const itemDate = new Date(item.date)
            return itemDate >= startDate && itemDate <= endDate
          })
        }
        break

      default:
        filteredData = [...originalTableData]
    }

    setFilteredTableData(filteredData)
    setDateFilter(filterType)
  }

  // Sort Change Handler
  const handleSortChange = (sortBy) => {
    const sortedData = [...filteredTableData].sort((a, b) => {
      switch (sortBy) {
        case 'netAmount':
          return b.netAmount - a.netAmount
        case 'grossAmount':
          return b.grossAmount - a.grossAmount
        case 'platformFee':
          return b.platformFee - a.platformFee
        default:
          return 0
      }
    })

    setFilteredTableData(sortedData)
    setSortOption(sortBy)
  }

  return (
    <div className="container-fluid px-4 py-4">
      <PageMetaData title="Payment Reports" />
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <h1 className="h3 mb-0">Payment Reports</h1>
      </div>
      <PaymentSummaryTiles />
      <PaymentReportsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tableData={filteredTableData}
        onDateFilterChange={handleDateFilterChange}
        onSortChange={handleSortChange}
      />
      <PaymentReportsTable searchQuery={searchQuery} />
    </div>
  )
}

export default PaymentReports
