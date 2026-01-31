# **App Name**: Deskify

## Core Features:

- User Authentication: Secure email and password-based authentication with Firebase Authentication, with 'user' and 'admin' roles.
- Resource Booking: Book workstations and meeting rooms, preventing double bookings, including date, time, and membership plan selection. A Firestore trigger confirms or cancels bookings.
- Payment Integration: Integrate Razorpay for payments; store payment records in Firestore and generate invoices.
- User Dashboard: Mobile-first user dashboard to view availability, book resources, buy memberships, view bookings, and download invoices.
- Admin Dashboard: Admin dashboard to oversee occupancy, revenue, bookings, users, plans, and payments. Admins can block desks or rooms and manage membership plans.
- Public Pages: Public-facing landing page with information about the space, amenities, pricing, and real-time availability. Incorporates a 'Book a Seat' call to action.
- AI-powered booking optimizer: Based on the usage of the coworking space, and incorporating factors like time of day and typical use of the space on specific days of the week, suggests which spaces would maximize focus based on ambient sound levels and crowd level.

## Style Guidelines:

- Primary color: Deep slate (#1C1F26) for a luxurious and calming feel.
- Background color: Light beige (#FAFAF8), visibly the same hue as the primary color, but highly desaturated and bright.
- Accent color: Muted bronze (#C28E3D), analogous to the primary but with different brightness and saturation to create contrast.
- Font: 'Inter' (sans-serif) for headings and body text. Note: currently only Google Fonts are supported.
- Use exclusively Lucide icons for a consistent and minimalist aesthetic.
- Employ clean grid layouts with generous whitespace and soft rounded cards for a spacious, architectural feel, using Tailwind CSS and customized shadcn/ui components.
- Implement subtle shadows on hover to create a tactile experience without being distracting.