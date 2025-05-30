import PasswordFormInput from '@/components/form/PasswordFormInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, Spinner } from 'react-bootstrap';

const schema = yup.object({
  currentPassword: yup.string().required('Enter your current password'),
  newPassword: yup.string().required('Enter your new password'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm your new password'),
});

const PasswordChange = () => {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    // call changePassword API
    reset();
  };

  return (
    <Card className="password-change-card p-4">
      <h6 className="mb-3 fw-semibold text-secondary">Change Password</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PasswordFormInput name="currentPassword" label="Current Password" control={control} />
        <PasswordFormInput name="newPassword" label="New Password" control={control} />
        <PasswordFormInput name="confirmPassword" label="Confirm New Password" control={control} />
        <button
          type="submit"
          className="btn btn-outline-primary w-100 mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner size="sm" /> : 'Change Password'}
        </button>
      </form>
    </Card>
  );
};

export default PasswordChange;
