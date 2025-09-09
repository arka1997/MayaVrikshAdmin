import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          className={cn(
            'form-input',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
