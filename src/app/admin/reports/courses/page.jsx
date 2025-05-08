import PageMetaData from '@/components/PageMetaData';
import { useState, useEffect } from 'react';
import CourseReportsHeader from '../components/CourseReportsHeader';
import CourseReportsTable from '../components/CourseReportsTable';
import { CourseSummaryTiles } from '../components/SummaryTiles';

const CourseReports = () => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortOption, setSortOption] = useState(null);

  // State for table data
  const [originalTableData, setOriginalTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  // Fetch initial data (replace with your actual data fetching method)
  useEffect(() => {
    const fetchCourseReports = async () => {
      try {
        // Replace this with your actual data fetching logic
        const response = await fetch('/api/course-reports');
        const data = await response.json();
        setOriginalTableData(data);
        setFilteredTableData(data);
      } catch (error) {
        console.error('Failed to fetch course reports:', error);
      }
    };

    fetchCourseReports();
  }, []);

  // Date Filter Change Handler
  const handleDateFilterChange = (filterType, startDate, endDate) => {
    let filteredData = [...originalTableData];

    switch(filterType) {
      case 'last7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= sevenDaysAgo;
        });
        break;

      case 'lastMonth':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= oneMonthAgo;
        });
        break;

      case 'lastQuarter':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= threeMonthsAgo;
        });
        break;

      case 'custom':
        if (startDate && endDate) {
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        break;

      default:
        filteredData = [...originalTableData];
    }

    setFilteredTableData(filteredData);
    setDateFilter(filterType);
  };

  // Sort Change Handler
  const handleSortChange = (sortBy) => {
    const sortedData = [...filteredTableData].sort((a, b) => {
      switch(sortBy) {
        case 'courseName':
          return a.courseName.localeCompare(b.courseName);
        case 'enrollments':
          return b.enrollments - a.enrollments;
        case 'completionRate':
          return b.completionRate - a.completionRate;
        default:
          return 0;
      }
    });

    setFilteredTableData(sortedData);
    setSortOption(sortBy);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <PageMetaData title="Course Reports" />
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <h1 className="h3 mb-0">Course Reports</h1>
      </div>
      <CourseSummaryTiles />
      <CourseReportsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tableData={filteredTableData}
        onDateFilterChange={handleDateFilterChange}
        onSortChange={handleSortChange}
      />
      <CourseReportsTable data={filteredTableData} />
    </div>
  );
};

export default CourseReports;