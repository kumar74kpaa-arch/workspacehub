'use client';
import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/lib/country-codes';
import { ScrollArea } from '../ui/scroll-area';

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
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedCountryName, setSelectedCountryName] = useState('India');

  useEffect(() => {
    const selectedCountry = countryCodes.find(c => c.name === selectedCountryName);
    if (selectedCountry) {
        setCountryCode(selectedCountry.code);
    }
  }, [selectedCountryName]);

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
    const formattedPhone = `${countryCode}${phone}`;

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
        setIsLoading(false);
        return;
      }
      
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please check the phone number or try again later.' });

    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirmationResult || !firestore) return;
    setIsLoading(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      await redirectUserBasedOnRole(firestore, user, router);
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
                    <div className="flex items-center gap-2">
                        <Select value={selectedCountryName} onValueChange={setSelectedCountryName}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <ScrollArea className="h-72">
                                {countryCodes.map((country) => (
                                    <SelectItem key={country.name} value={country.name}>
                                        <span className="flex items-center gap-2">
                                            <span>{country.flag}</span>
                                            <span className="truncate">{country.name} ({country.code})</span>
                                        </span>
                                    </SelectItem>
                                ))}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || phone.length < 5}>
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
