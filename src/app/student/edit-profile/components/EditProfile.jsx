import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, Spinner } from 'react-bootstrap'
import * as yup from 'yup'
import { getProfile, updateProfile } from '@/helpers/studentApi'
import TextFormInput from '@/components/form/TextFormInput'
import { useNotificationContext } from '@/context/useNotificationContext'

const schema = yup.object({
  first_name: yup.string().required('Enter first name'),
  last_name: yup.string().required('Enter last name'),
  email: yup.string().email('Enter valid email').required('Email required'),
  phone: yup.string().required('Enter phone'),
  enrollment_date: yup.string().required('Enter enrollment date'),
  program: yup.string(),
  semester: yup.string(),
  year: yup.string(),
  status: yup.string(),
  courses: yup.string(),
})

const BLUE_AVATAR = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="avatarGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="32" fill="url(#avatarGradient)" />
    <ellipse cx="32" cy="25" rx="15" ry="13" fill="#fff" fillOpacity="0.95" />
    <ellipse cx="32" cy="49" rx="21" ry="12" fill="#fff" fillOpacity="0.85" />
    <ellipse cx="32" cy="25" rx="10" ry="8.5" fill="#60a5fa" fillOpacity="0.8" />
    <ellipse cx="27" cy="29" rx="1.5" ry="2" fill="#2563eb" />
    <ellipse cx="37" cy="29" rx="1.5" ry="2" fill="#2563eb" />
    <path d="M27 33 Q32 37 37 33" stroke="#2563eb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

const EditProfile = () => {
  const [loading, setLoading] = useState(true)
  const [avatar, setAvatar] = useState(null)
  const fileRef = useRef()
  const { showNotification } = useNotificationContext()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      enrollment_date: '',
      program: '',
      semester: '',
      year: '',
      status: '',
      courses: '',
    },
  })

  useEffect(() => {
    getProfile().then((data) => {
      reset({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        enrollment_date: data.enrollment_date || '',
        program: data.program || '',
        semester: data.semester || '',
        year: data.year || '',
        status: data.status || '',
        courses: Array.isArray(data.courses) ? data.courses.join(', ') : data.courses || '',
      })
      setAvatar(data.profile_picture || null)
      setLoading(false)
    })
  }, [reset])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(URL.createObjectURL(file))
      setValue('profile_picture', file)
    }
  }

  const onSubmit = async (formData) => {
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value ?? '')
    })
    if (fileRef.current?.files[0]) {
      form.append('profile_picture', fileRef.current.files[0])
    }

    try {
      await updateProfile(form)
      showNotification({
        title: 'Success',
        message: 'Profile updated successfully!',
        variant: 'success',
        delay: 3000,
      })
    } catch (err) {
      console.error('Update failed:', err)
      showNotification({
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        variant: 'danger',
        delay: 3000,
      })
    }
  }

  const resolvedAvatarURL =
    avatar && typeof avatar === 'string'
      ? avatar.startsWith('http') || avatar.startsWith('blob:')
        ? avatar
        : `${import.meta.env.VITE_API_BASE_URL}${avatar}`
      : null

  return (
    <Card className="edit-profile-card px-4 py-3" style={{ maxWidth: '100%', width: '100%' }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
           {/* Heading moved below avatar */}
          <h5 className="text-center mb-4 mt-2 fw-bold">Edit Profile</h5>
          <div className="edit-profile-avatar d-flex flex-column align-items-center mt-3 mb-1 position-relative">
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 4px #fff',
                overflow: 'hidden',
              }}
            >
              {resolvedAvatarURL ? (
                <img
                  src={resolvedAvatarURL}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = ''
                  }}
                />
              ) : (
                BLUE_AVATAR
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                bottom: -5,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0,
                width: 90,
                height: 35,
                cursor: 'pointer',
              }}
              title="Upload profile picture"
            />
            <button type="button" className="btn btn-sm btn-primary mt-2" onClick={() => fileRef.current.click()}>
              Change Photo
            </button>
          </div>

       

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gx-2">
              <div className="col-md-6 mb-3">
                <TextFormInput name="first_name" label="First Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="last_name" label="Last Name" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="email" label="Email" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="phone" label="Phone" control={control} />
              </div>
              <div className="col-md-6 mb-3">
                <TextFormInput name="enrollment_date" label="Enrollment Date" control={control} type="date" />
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
  )
}

export default EditProfile
