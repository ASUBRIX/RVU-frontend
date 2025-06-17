import { Controller } from 'react-hook-form'
import { Form } from 'react-bootstrap'

const SelectFormInput = ({ 
  name, 
  label, 
  control, 
  options = [], 
  placeholder = 'Select an option',
  className = '',
  ...otherProps 
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Group className={className}>
          {label && <Form.Label>{label}</Form.Label>}
          <Form.Select
            {...field}
            {...otherProps}
            isInvalid={!!error}
            className={error ? 'is-invalid' : ''}
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          {error && (
            <Form.Control.Feedback type="invalid">
              {error.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}
    />
  )
}

export default SelectFormInput