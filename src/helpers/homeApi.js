import httpClient from './httpClient'; 



export const fetchTrendingCourses = async () => {
  const res = await httpClient.get('/api/trending-courses');
  return res.data;
};

export const fetchOfferCourses = async () => {
  const res = await httpClient.get('/api/offer-courses');
  return res.data;
};

export const fetchAllInstructors = async () => {
  const res = await httpClient.get('/api/instructors');
  return res.data;
};

export const fetchStudentsReviews = async () => {
  const res = await httpClient.get('/api/student-reviews');
  return res.data;
};

export const fetchUpcomingEvents = async () => {
  const res = await httpClient.get('/api/events');
  return res.data;
};

export const fetchPopularCourses = async () => {
  const res = await httpClient.get('/api/popular-courses');
  return res.data;
};


export const fetchHeroSlides = async () => {
  const res = await httpClient.get('/api/slides');
  return res.data;
};

export const fetchNoticeBoard = async ()=>{
  const res = await httpClient.get('/api/notice-board');
  return res.data;
}



export default {
  fetchTrendingCourses,
  fetchOfferCourses,
  fetchAllInstructors,
  fetchStudentsReviews,
  fetchUpcomingEvents,
  fetchPopularCourses,
  fetchNoticeBoard,
};
