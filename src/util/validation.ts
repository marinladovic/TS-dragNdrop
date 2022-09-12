/**
 * VALIDATION
 * 1. Define the structure of the object that is able to be validated (Validatable)
 * 2. Define a function that takes an object and returns a boolean (validate)
 */
export interface Validatable {
  /* 1. */
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(input: Validatable) {
  /* 2. */
  let isValid = true;

  /* If the input is required, check if there is an input */
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }

  /* If the input has a minimum length, check if the input is long enough */
  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minLength;
  }

  /* If the input has a maximum length, check if the input is short enough */
  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxLength;
  }

  /* If the input has a minimum value, check if the input is big enough */
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }

  /* If the input has a maximum value, check if the input is small enough */
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
}
