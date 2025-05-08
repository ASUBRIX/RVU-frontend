import { FaBookReader, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import element1 from '@/assets/images/element/abc.svg';
import element2 from '@/assets/images/element/lego.svg';
import element3 from '@/assets/images/element/sport.svg';
import element4 from '@/assets/images/element/song.svg';
import elem1 from '@/assets/images/element/online-session.svg';
import elem2 from '@/assets/images/element/one-to-one.svg';
import elem3 from '@/assets/images/element/test-series.svg';
import elem4 from '@/assets/images/element/toppers-study.svg';
export const counterData = [{
  title: 'Total Students',
  count: 1,
  icon: FaUserGraduate,
  variant: 'text-info',
  suffix: 'K'
}, {
  title: 'Total Instructors',
  count: 105,
  icon: FaChalkboardTeacher,
  variant: 'text-purple'
}, {
  title: 'Total Activities',
  count: 2,
  icon: FaBookReader,
  variant: 'text-danger',
  suffix: 'K+'
}];
export const offerCourses = [{
  image: elem1,
  title: 'Online Sessions',
  description: 'Join interactive sessions with live lectures and discussions.',
}, {
  image: elem3,
  title: 'Test Series',
  description: 'Test your knowledge with exam simulations for better proficiency.',
}, {
  image: elem2,
  title: '1 to 1 Mentorship',
  description: 'Get expert mentorship with personalized guidance.',
}, {
  image: elem4,
  title: "Topper's Study Material",
  description: "Access topper insights with exclusive study materials.",
}];
