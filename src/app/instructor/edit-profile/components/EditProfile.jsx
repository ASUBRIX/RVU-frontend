import { useState, useEffect } from 'react';
import avatar7 from '@/assets/images/avatar/07.jpg';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, CardHeader, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsPlus, BsX } from 'react-icons/bs';
import * as yup from 'yup';
import httpClient from '@/helpers/httpClient';
import { useNotificationContext } from '@/context/useNotificationContext';
import { useAuthContext } from '@/context/useAuthContext';

// Backend base URL - adjust this to match your backend server
const BACKEND_URL = 'http://localhost:3000';

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [education, setEducation] = useState([{ institution: '', degree: '', year: '' }]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { showNotification } = useNotificationContext();
  const { user } = useAuthContext();

  const profileSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Please enter valid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    about: yup.string()
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      about: ''
    }
  });

  const aboutValue = watch('about');

  useEffect(() => {
    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  // Helper function to convert relative path to absolute URL
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
    return `${BACKEND_URL}/${path}`;
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await httpClient.get('/api/students/profile', {
        headers: {
          'auth_key': user?.token
        }
      });
      
      console.log('Profile data received:', response.data);
      
      if (response.data) {
        const { first_name, last_name, email, phone, about, education, profile_picture } = response.data;
        
        reset({
          firstName: first_name || '',
          lastName: last_name || '',
          email: email || '',
          phone: phone || '',
          about: about || ''
        });
        
        setEducation(education && education.length > 0 ? education : [{ institution: '', degree: '', year: '' }]);
        
        // Handle profile picture URL properly
        setProfilePicture(profile_picture);
        if (profile_picture) {
          setProfilePictureUrl(getFullImageUrl(profile_picture));
        } else {
          setProfilePictureUrl(null);
        }
      }
      
      setProfileLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
      setProfileLoading(false);
      showNotification({
        message: 'Failed to load profile',
        variant: 'danger'
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        about: data.about,
        education: JSON.stringify(education),
        profilePicture: null // This will be updated separately if needed
      };

      console.log('Submitting profile data:', profileData);
      
      const response = await httpClient.put('/api/students/profile', profileData, {
        headers: {
          'auth_key': user?.token
        }
      });
      
      console.log('Profile update response:', response.data);
      
      if (response.data && response.data.message) {
        showNotification({
          message: response.data.message || 'Profile updated successfully',
          variant: 'success'
        });
        
        // Update profile picture URL if returned in response
        if (response.data.student && response.data.student.profile_picture) {
          setProfilePicture(response.data.student.profile_picture);
          setProfilePictureUrl(getFullImageUrl(response.data.student.profile_picture));
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
      setLoading(false);
      
      showNotification({
        message: err.response?.data?.error || 'Failed to update profile',
        variant: 'danger'
      });
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEducation(updatedEducation);
  };

  const addEducationField = () => {
    setEducation([...education, { institution: '', degree: '', year: '' }]);
  };

  const removeEducationField = (index) => {
    if (education.length > 1) {
      const updatedEducation = education.filter((_, i) => i !== index);
      setEducation(updatedEducation);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Show local preview immediately
        document.getElementById('uploadfile-1-preview').src = reader.result;
      };
      reader.readAsDataURL(file);
      uploadProfilePicture(file);
    }
  };

  const removeProfilePicture = () => {
    setImageFile(null);
    setProfilePicture(null);
    setProfilePictureUrl(null);
    document.getElementById('uploadfile-1-preview').src = avatar7;
    document.getElementById('uploadfile-1').value = '';
  };

  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await httpClient.post('/api/students/profile/upload-picture', formData, {
        headers: {
          'auth_key': user?.token
          // Content-Type will be set automatically for FormData by the httpClient
        }
      });
      
      if (response.data && response.data.profilePicture) {
        const picturePath = response.data.profilePicture;
        setProfilePicture(picturePath);
        setProfilePictureUrl(getFullImageUrl(picturePath));
        
        showNotification({
          message: response.data.message || 'Profile picture updated successfully',
          variant: 'success'
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Profile picture upload error:', err);
      showNotification({
        message: err.response?.data?.error || 'Failed to upload profile picture',
        variant: 'danger'
      });
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Card className="bg-transparent border rounded-3">
        <CardBody className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border rounded-3">
      <CardHeader className="bg-transparent border-bottom">
        <h3 className="card-header-title mb-0">Edit Profile</h3>
      </CardHeader>
      <CardBody>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12} className="justify-content-center align-items-center">
            <label className="form-label">Profile picture</label>
            <div className="d-flex align-items-center">
              <label className="position-relative me-4" htmlFor="uploadfile-1" title="Replace this pic">
                <span className="avatar avatar-xl">
                  <img 
                    id="uploadfile-1-preview" 
                    className="avatar-img rounded-circle border-white border-3 shadow" 
                    src={profilePictureUrl || avatar7} 
                    alt="Profile" 
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.src = avatar7;
                    }}
                  />
                </span>
                <button type="button" className="uploadremove" onClick={removeProfilePicture}>
                  <BsX className="bi bi-x text-white" />
                </button>
              </label>
              <label className="btn btn-primary-soft mb-0" htmlFor="uploadfile-1">
                Change
              </label>
              <input 
                id="uploadfile-1" 
                className="form-control d-none" 
                type="file" 
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </Col>

          <TextFormInput name="firstName" label="First name" control={control} containerClassName="col-md-6" />
          <TextFormInput name="lastName" label="Last name" control={control} containerClassName="col-md-6" />

          <TextFormInput name="email" label="Email id" control={control} containerClassName="col-md-6" disabled={true}/>
          <TextFormInput name="phone" label="Phone number" control={control} containerClassName="col-md-6" disabled={true}/>
          
          <Col xs={12}>
            <label className="form-label">About me</label>
            <textarea 
              className="form-control" 
              rows={3} 
              name="about"
              value={aboutValue || ''}
              onChange={(e) => setValue('about', e.target.value)}
              {...register('about')}
            />
            <div className="form-text">Brief description for your profile.</div>
          </Col>
          
          <Col xs={12}>
            <label className="form-label">Education</label>
            {education.map((edu, index) => (
              <div key={index} className="d-flex mb-2 gap-2">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Institution"
                  value={edu.institution || ''}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Degree"
                  value={edu.degree || ''}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Year"
                  value={edu.year || ''}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                />
                {education.length > 1 && (
                  <Button variant="danger" size="sm" onClick={() => removeEducationField(index)}>
                    <BsX />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="light" size="sm" className="mb-0 icon-center" onClick={addEducationField}>
              <BsPlus className="me-1" />
              Add more
            </Button>
          </Col>
          
          <div className="d-sm-flex justify-content-end">
            <Button type="submit" variant="primary" className="mb-0" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditProfile;
