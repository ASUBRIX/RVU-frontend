import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Spinner } from 'react-bootstrap';
import * as yup from 'yup';
import { getProfile, updateProfile } from '@/helpers/userApi';
import TextFormInput from '@/components/form/TextFormInput';



const schema = yup.object({
  first_name: yup.string().required('Enter first name'),
  last_name: yup.string().required('Enter last name'),
  email: yup.string().email('Enter valid email').required('Email required'),
  phone_number: yup.string().required('Enter phone'),
  student_first_name: yup.string().required('Enter first name'),
  student_last_name: yup.string().required('Enter last name'),
  student_email: yup.string().email('Enter valid email').required('Email required'),
  student_phone: yup.string().required('Enter phone'),
  enrollment_date: yup.string(),
  program: yup.string(),
  semester: yup.string(),
  year: yup.string(),
  status: yup.string(),
  courses: yup.mixed(),
});

const EditProfile = () => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      student_first_name: '',
      student_last_name: '',
      student_email: '',
      student_phone: '',
      enrollment_date: '',
      program: '',
      semester: '',
      year: '',
      status: '',
      courses: '',
    },
  });

  useEffect(() => {
    getProfile().then((data) => {
      reset({
        first_name: data.user_first_name || '',
        last_name: data.user_last_name || '',
        email: data.user_email || '',
        phone_number: data.user_phone_number || '',
        student_first_name: data.first_name || '',
        student_last_name: data.last_name || '',
        student_email: data.email || '',
        student_phone: data.phone || '',
        enrollment_date: data.enrollment_date || '',
        program: data.program || '',
        semester: data.semester || '',
        year: data.year || '',
        status: data.status || '',
        courses: data.courses || '',
      });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  return (
    <Card className="edit-profile-card px-3 py-2">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {/* Optional: Profile Image */}
          <div className="edit-profile-avatar">
            <img
              src="/images/default-avatar.png"
              alt="Profile"
              className="edit-profile-avatar-img"
            />
            {/* You can add a button here for uploading */}
          </div>
          <h5 className="text-center mb-1">Edit Profile</h5>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* User Info */}
            <div className="section-title">User Info</div>
            <div className="row gx-2">
              <div className="col-md-6 mb-3">
                <TextFormInput name="first_name" label="User First Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="last_name" label="User Last Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="email" label="User Email" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="phone_number" label="User Phone" control={control} />
              </div>
            </div>
            {/* Student Info */}
            <div className="section-title">Student Info</div>
            <div className="row gx-2">
              <div className="col-md-6 mb-3">
                <TextFormInput name="student_first_name" label="Student First Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="student_last_name" label="Student Last Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="student_email" label="Student Email" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="student_phone" label="Student Phone" control={control} />
              </div>
            </div>
            {/* Academic Details */}
            <div className="section-title">Academic Details</div>
            <div className="row gx-2">
              <div className="col-md-6 mb-3">
                <TextFormInput name="enrollment_date" label="Enrollment Date" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="program" label="Program" control={control} />
              </div>
              <div className="col-md-4 mb-3">
                <TextFormInput name="semester" label="Semester" control={control} />
              </div>
              <div className="col-md-4 mb-3">
                <TextFormInput name="year" label="Year" control={control} />
              </div>
              <div className="col-md-4 mb-3">
                <TextFormInput name="status" label="Status" control={control} />
              </div>
              <div className="col-12 mb-3">
                <TextFormInput name="courses" label="Courses (comma separated)" control={control} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Save changes'}
            </button>
          </form>
        </>
      )}
    </Card>
  );
};

export default EditProfile;
