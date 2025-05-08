import Choices from 'choices.js';
import { useEffect, useRef } from 'react';

const ChoicesFormInput = ({
  children,
  multiple,
  className,
  onChange,
  allowInput,
  options = {}, // Default to empty object
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstance = useRef(null); // Store Choices.js instance

  useEffect(() => {
    if (choicesRef.current) {
      // Destroy previous Choices instance before reinitializing
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
      }

      choicesInstance.current = new Choices(choicesRef.current, {
        ...options,
        placeholder: true,
        allowHTML: true,
        shouldSort: false,
        searchEnabled: true, // Allow searching
        renderChoiceLimit: -1, // Ensure all options are visible
      });

      // Add event listener for value change
      choicesInstance.current.passedElement.element.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLSelectElement)) return;
        if (onChange) {
          onChange(e.target.value);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
      }
    };
  }, [options, onChange]); // Dependencies updated

  return allowInput ? (
    <input ref={choicesRef} multiple={multiple} className={className} {...props} />
  ) : (
    <select ref={choicesRef} multiple={multiple} className={className} {...props}>
      {children}
    </select>
  );
};

export default ChoicesFormInput;
