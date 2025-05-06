import IconTextFormInput from '@/components/form/IconTextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { BsEnvelopeFill } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import * as yup from 'yup';
const SingUpForm = () => {
  const editEmailFormSchema = yup.object({
    email: yup.string().email('Please enter valid email').required('Please enter your Email'),
    password: yup.string().required('Please enter your Password'),
    confirmPassword: yup.string().required('Please enter your Confirm Password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(editEmailFormSchema)
  });
  return <form onSubmit={handleSubmit(() => {})}>
      <div className="mb-4 ">
        <IconTextFormInput control={control} icon={BsEnvelopeFill} placeholder="E-mail" label="Email address *" name="email" />
      </div>
      <div className="mb-4">
        <IconTextFormInput control={control} icon={FaLock} placeholder="*********" label="Password *" name="password" />
      </div>
      <div className="mb-4">
        <IconTextFormInput control={control} icon={FaLock} placeholder="*********" label="Confirm Password *" name="confirmPassword" />
      </div>
      <div className="mb-4">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="checkbox-1" />
          <label className="form-check-label" htmlFor="checkbox-1">
            By signing up, you agree to the<a href="#"> terms of service</a>
          </label>
        </div>
      </div>
      <div className="align-items-center mt-0">
        <div className="d-grid">
          <button className="btn btn-primary mb-0" type="submit">
            Sign Up
          </button>
        </div>
      </div>
    </form>;
};
export default SingUpForm;
