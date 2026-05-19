import { forwardRef } from 'react';
import Input from '@atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({ label, error, id, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
    <Input ref={ref} id={id} error={error} {...props} />
  </div>
));
FormField.displayName = 'FormField';
export default FormField;
