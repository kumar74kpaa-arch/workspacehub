'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, KeyRound } from 'lucide-react';
import { redirectUserBasedOnRole } from '@/firebase/auth/actions';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function PhoneLoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }
  };

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier!;
    const formattedPhone = `+91${phone}`;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep('otp');
      toast({ title: 'OTP Sent', description: 'Please check your phone for the verification code.' });
    } catch (error: any) {
      console.error("OTP Error", error);
      if (error.code === "auth/billing-not-enabled") {
        toast({
          title: "OTP Temporarily Disabled",
          description:
            "Phone login will be activated once SMS billing is enabled.",
          variant: "destructive",
        });
        return;
      }
      
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please check the phone number or try again later.' });

    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirmationResult) return;
    setIsLoading(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      const userDocRef = doc(firestore!, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          displayName: `User ${user.uid.substring(0, 5)}`,
          email: user.email, // phone users might not have email
          photoURL: user.photoURL,
          role: 'user',
          provider: 'phone',
          createdAt: serverTimestamp(),
        });
      }

      await redirectUserBasedOnRole(firestore!, user.uid, router);
      toast({ title: 'Success', description: 'You have successfully signed in.' });
    } catch (error: any) {
       console.error("Verification Error", error);
       toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The OTP you entered is incorrect. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-4">
        <div id="recaptcha-container"></div>
        {step === 'phone' ? (
            <form onSubmit={onSendOtp} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="pl-20"
                            required
                            pattern="\d{10}"
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || phone.length !== 10}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                </Button>
                 <p className="text-xs text-muted-foreground text-center pt-2">
                    Phone OTP login will be activated after production setup.
                </p>
            </form>
        ) : (
            <form onSubmit={onVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                     <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="otp"
                            type="text"
                            placeholder="6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="pl-10 tracking-[0.5em] text-center"
                            maxLength={6}
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                     {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                </Button>
                <Button variant="link" size="sm" className="w-full" onClick={() => setStep('phone')}>
                    Back to phone number
                </Button>
            </form>
        )}
    </div>
  );
}
