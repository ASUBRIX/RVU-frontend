import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { changeEmail, getProfile } from '@/helpers/userApi';
import { useEffect } from 'react';
import TextFormInput from '@/components/form/TextFormInput';
import { Card, Spinner } from 'react-bootstrap';

const schema = yup.object({
  email: yup.string().email().required('Enter your new email'),
});

const EmailChange = () => {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' }
  });

  useEffect(() => {
    getProfile().then((data) => {
      reset({ email: data.email });
    });
  }, [reset]);

  const onSubmit = async ({ email }) => {
    await changeEmail(email);
    // Optionally show success message
  };

  return (
    <Card className="email-change-card p-4">
      <h6 className="mb-3 fw-semibold text-secondary">Change Email</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFormInput name="email" label="New Email" control={control} />
        <button
          type="submit"
          className="btn btn-outline-primary w-100 mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner size="sm" /> : 'Update Email'}
        </button>
      </form>
    </Card>
  );
};

export default EmailChange;
