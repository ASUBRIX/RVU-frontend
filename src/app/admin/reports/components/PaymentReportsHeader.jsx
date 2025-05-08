import React, { useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Overlay, Popover } from 'react-bootstrap'
import { 
  FaFileExport, 
  FaCalendar, 
  FaSearch, 
  FaFilter, 
  FaFileDownload 
} from 'react-icons/fa'
import * as XLSX from 'xlsx'
import styles from './PaymentReportsHeader.module.scss'

const PaymentReportsHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  tableData, 
  onDateFilterChange, 
  onSortChange 
}) => {
  // State for date range
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dateFilterRef = useRef(null)

  // State for dropdowns
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  const exportDropdownRef = useRef(null)

  // Export function to handle Excel and PDF exports
  const handleExport = (format) => {
    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Reports')
      XLSX.writeFile(workbook, 'payment_reports.xlsx')
    } else if (format === 'pdf') {
      const doc = new jsPDF()
      doc.autoTable({
        head: [Object.keys(tableData[0])],
        body: tableData.map((row) => Object.values(row)),
      })
      doc.save('payment_reports.pdf')
    }
    setShowExportDropdown(false)
  }

  // Handle custom date range selection
  const handleDateRangeSelect = () => {
    if (startDate && endDate) {
      onDateFilterChange('custom', startDate, endDate)
      setShowDatePicker(false)
    }
  }

  return (
    <div className={styles.headerContainer}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          className={`form-control ${styles.searchInput}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search payments..."
        />
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {/* Date Filter Button */}
        <button 
          ref={dateFilterRef}
          className={styles.actionButton}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <FaCalendar /> Date Filter
        </button>
        <Overlay
          show={showDatePicker}
          target={dateFilterRef.current}
          placement="bottom"
          containerPadding={20}
        >
          <Popover id="date-filter-popover" className={styles.datePickerPopover}>
            <Popover.Body>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                inline
                placeholderText="Select date range"
                dateFormat="MM/dd/yyyy"
              />
              <div className="d-flex justify-content-between mt-2">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleDateRangeSelect}
                  disabled={!startDate || !endDate}
                >
                  Apply
                </button>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>

        {/* Sort Button */}
        <div className="position-relative">
          <button 
            ref={sortDropdownRef}
            className={styles.actionButton}
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <FaFilter /> Sort By
          </button>
          <Overlay
            show={showSortDropdown}
            target={sortDropdownRef.current}
            placement="bottom"
            containerPadding={20}
          >
            <Popover id="sort-dropdown-popover">
              <Popover.Body>
                <div className="d-flex flex-column">
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      onSortChange('netAmount')
                      setShowSortDropdown(false)
                    }}
                  >
                    Net Amount
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      onSortChange('grossAmount')
                      setShowSortDropdown(false)
                    }}
                  >
                    Gross Amount
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      onSortChange('platformFee')
                      setShowSortDropdown(false)
                    }}
                  >
                    Platform Fee
                  </button>
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>
        </div>

        {/* Export Button */}
        <div className="position-relative">
          <button 
            ref={exportDropdownRef}
            className={styles.actionButton}
            onClick={() => setShowExportDropdown(!showExportDropdown)}
          >
            <FaFileDownload /> Export
          </button>
          <Overlay
            show={showExportDropdown}
            target={exportDropdownRef.current}
            placement="bottom"
            containerPadding={20}
          >
            <Popover id="export-dropdown-popover">
              <Popover.Body>
                <div className="d-flex flex-column">
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleExport('excel')}
                  >
                    Export to Excel
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleExport('pdf')}
                  >
                    Export to PDF
                  </button>
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>
        </div>
      </div>
    </div>
  )
}

export default PaymentReportsHeader