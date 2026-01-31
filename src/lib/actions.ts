'use server';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to Login.',
    };
  }
  
  console.log('Login attempt:', validatedFields.data);
  // In a real app, you would handle authentication with Firebase here
  // and redirect on success.
  
  return { message: 'Login functionality is a placeholder.' };
}

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to Sign Up.',
    };
  }
  
  console.log('Signup attempt:', validatedFields.data);
  // In a real app, you would create a user with Firebase Auth here
  // and redirect on success.
  
  return { message: 'Signup functionality is a placeholder.' };
}
