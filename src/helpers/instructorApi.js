import httpClient from './httpClient';

export const fetchInstructors = async () => {
  try {
    const res = await httpClient.get('/api/instructors');
    
    // Verify bio field is now included
    if (res.data && res.data.length > 0) {
      console.log('Sample instructor fields:', Object.keys(res.data[0]));
      const withBio = res.data.find(instructor => instructor.bio);
      if (withBio) {
        console.log('Found instructor with bio:', withBio.name);
      }
    }
    
    return res.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};