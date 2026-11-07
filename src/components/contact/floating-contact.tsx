'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Phone, X, MessageSquare, Compass, Laptop, Users, Building2, MapPin, Send, ArrowUpRight, Clock } from 'lucide-react';
import { CONTACT_CONFIG, WHATSAPP_ENQUIRY_OPTIONS, getWhatsAppUrl } from '@/lib/contact-config';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

// Official WhatsApp brand SVG icon
export function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="h-4 w-4 text-emerald-600" />,
  Compass: <Compass className="h-4 w-4 text-amber-600" />,
  Laptop: <Laptop className="h-4 w-4 text-sky-600" />,
  Users: <Users className="h-4 w-4 text-purple-600" />,
  Building2: <Building2 className="h-4 w-4 text-amber-700" />,
  MapPin: <MapPin className="h-4 w-4 text-lime-700" />,
};

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenOption = (message: string, optionId: string) => {
    trackEvent('whatsapp_click', {
      channel: 'floating_popup',
      label: optionId,
    });
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    trackEvent('whatsapp_click', {
      channel: 'floating_popup_custom',
      label: 'custom_query',
    });
    const url = getWhatsAppUrl(customMsg.trim());
    window.open(url, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
    setIsOpen(false);
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', {
      channel: 'floating_button',
      label: CONTACT_CONFIG.primaryContactName,
    });
  };

  return (
    <aside aria-label="Quick contact" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {/* Pop-up Card */}
      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-chat-heading"
          className="w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 sm:w-96"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
                <WhatsAppIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 id="whatsapp-chat-heading" className="text-base font-semibold leading-tight text-foreground">
                  Chat with 9to5 Workspace
                </h2>
                <div className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Replies typically within 15 mins</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp options"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Contextual Enquiry Options */}
          <div className="py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Select what you need:
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {WHATSAPP_ENQUIRY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOpenOption(opt.message, opt.id)}
                  className="group flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-left text-xs font-medium text-foreground transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/5"
                >
                  <span className="flex items-center gap-2">
                    {iconMap[opt.icon]}
                    <span>{opt.label}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#25D366]" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <form onSubmit={handleCustomSend} className="border-t pt-3">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Or type a question..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#25D366] focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#20ba5a]"
                title="Send via WhatsApp"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Immediate Call Alternative inside card */}
          <div className="mt-3 rounded-lg bg-secondary/50 p-2.5 text-center text-xs">
            <span className="text-muted-foreground">Need immediate assistance? </span>
            <a
              href={`tel:${CONTACT_CONFIG.primaryPhone}`}
              onClick={handlePhoneClick}
              className="font-semibold text-foreground underline hover:text-accent"
            >
              Call {CONTACT_CONFIG.primaryContactName}: {CONTACT_CONFIG.primaryPhoneDisplay}
            </a>
          </div>
        </div>
      )}

      {/* Persistent Button Bar */}
      <div className="flex items-center gap-2">
        {/* Click to Call Button */}
        <a
          href={`tel:${CONTACT_CONFIG.primaryPhone}`}
          onClick={handlePhoneClick}
          aria-label={`Call 9to5 Workspace (${CONTACT_CONFIG.primaryPhoneDisplay})`}
          className="group flex h-12 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-xl active:scale-95"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline">Call Us</span>
          <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
            {CONTACT_CONFIG.primaryPhoneDisplay}
          </span>
        </a>

        {/* WhatsApp Floating Action Button */}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (!isOpen) {
              trackEvent('whatsapp_click', {
                channel: 'floating_button_toggle',
              });
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open WhatsApp conversation options"
          className={cn(
            'group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-[#20ba5a] active:scale-95',
            isOpen ? 'rotate-90' : 'animate-bounce'
          )}
          style={{ animationDuration: '3s', animationIterationCount: '3' }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <WhatsAppIcon className="h-7 w-7" />
              {/* Notification dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
