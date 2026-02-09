'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleSignInButton } from './google-signin-button';
import { PhoneLoginForm } from './phone-login-form';
import { loginUserWithPassword, redirectUserBasedOnRole, signupUserWithPassword } from '@/firebase/auth/actions';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const SignupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    if (!auth || !firestore) return;
    setIsLoading(true);
    try {
      const user = await loginUserWithPassword(auth, values);
      await redirectUserBasedOnRole(firestore, user, router);
      toast({ title: 'Success', description: 'You have successfully signed in.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof SignupSchema>) => {
    if (!auth || !firestore) return;
    setIsLoading(true);

    const signupData = {
      displayName: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const user = await signupUserWithPassword(auth, signupData);
      await redirectUserBasedOnRole(firestore, user, router);
      toast({ title: 'Account Created', description: 'You have successfully created an account.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Signup Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone">Phone (OTP)</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="phone">
          <PhoneLoginForm />
        </TabsContent>

        <TabsContent value="email">
          {isSigningUp ? (
             <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <FormField control={signupForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="name@example.com" {...field} className="pl-10" /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><div className="relative"><Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" {...field} className="pl-10" /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
             </Form>
          ) : (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6 pt-4">
                <div className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="name@example.com" {...field} className="pl-10" /></div></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><div className="relative"><Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" {...field} className="pl-10" /></div></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          )}
           <div className="mt-4 text-center text-sm">
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSigningUp(!isSigningUp)} className="underline">
              {isSigningUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </TabsContent>
      </Tabs>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>
      <GoogleSignInButton buttonText="Continue with Google" />
    </>
  );
}
