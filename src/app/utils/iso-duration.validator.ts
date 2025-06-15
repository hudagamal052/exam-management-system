import { AbstractControl, ValidatorFn } from '@angular/forms';

export function isoDurationValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) return { required: true };


    const regex = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?$/i;
    const isValid = regex.test(value) && value.length > 2;
    
    return isValid ? null : { invalidDuration: true };
  };
}
