import type { Space } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

export const spacesData: Space[] = [
  {
    slug: 'banyan',
    name: 'The Banyan',
    description: 'A premium workspace designed for focused professionals seeking an elevated, distraction-free environment.',
    keyAmenities: ['12-Seater Conference Room', 'Dedicated Workstations', 'Premium Breakout Space'],
    imageUrl: '/layouts/5.jpg',
    imageHint: 'premium workspace',
    status: 'available',
    details: {
      overview: "The Banyan is our flagship premium workspace, meticulously designed for focused professionals. It offers a sophisticated, serene environment with top-tier amenities, from the fully-equipped conference room to comfortable breakout areas. Every detail is crafted to enhance productivity and comfort, making it an ideal choice for teams and individuals who value a truly professional atmosphere.",
      amenities: [
        {
          category: 'Work & Meeting',
          items: [
            { name: 'Conference Room', description: '12-seater room with TV, Video Conferencing, and Whiteboard. Base price includes 9 seats, with 3 extra seats available at an additional charge.' },
            { name: 'Meeting Room', description: 'A smaller 6-seater room perfect for private discussions or team huddles.' },
            { name: '12+ Individual Workstations', description: 'Ergonomic chairs and spacious desks for focused work.' },
            { name: 'High-speed Internet', description: 'Reliable fiber optic connectivity for seamless work.' },
            { name: 'Printing & Scanning', description: 'On-demand services available at a nominal charge.' },
            { name: 'Onsite Staff', description: 'Our professional team is available from 8AM to 6PM to assist you.' },
          ],
        },
        {
            category: 'Lifestyle & Comfort',
            items: [
                { name: 'Pantry', description: 'Includes complimentary tea, coffee, and RO water. Branded water is also available for purchase.' },
                { name: 'Breakout Space', description: 'A quiet, well-designed zone to relax or have informal discussions.' },
                { name: 'Air Conditioning', description: 'Fully climate-controlled environment for your comfort.' },
                { name: 'Professional Cleaning', description: 'Our spaces are professionally maintained and sanitized daily.' },
                { name: 'Modern Washrooms', description: 'Clean and hygienic facilities.'},
                { name: 'On-site Parking', description: 'Convenient parking available at owner\'s risk.'},
            ]
        }
      ],
      rules: [
        'Standard access from 8:00 AM to 6:00 PM. Extended hours are available with extra charges.',
        'This facility is exclusively for professional use to maintain a focused, productive atmosphere.',
        'Additional seating in conference rooms and other services like printing are chargeable.',
      ],
      gallery: [
        {
          id: 'banyan-gallery-space',
          title: 'Our Space',
          imageUrls: [
            '/layouts/1.jpg',
            '/layouts/2.jpg',
            '/layouts/3.jpg',
            '/layouts/5.jpg',
          ]
        }
      ]
    }
  },
  {
    slug: 'olive',
    name: 'The Olive',
    description: 'A vibrant, collaborative workspace for modern professionals who thrive in a dynamic community setting.',
    keyAmenities: ['Meeting Room', 'Flexible Seating'],
    imageUrl: 'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-4.jpg',
    imageHint: 'collaborative office',
    status: 'available',
    details: {
      overview: "The Olive is a vibrant and flexible workspace designed for collaboration and creativity. It's a perfect fit for startups, freelancers, and teams looking for a dynamic environment. With a mix of workstations, a meeting room, and a fun breakout area, The Olive encourages both productivity and community interaction.",
      amenities: [
        {
          category: 'Work & Meeting',
          items: [
            { name: '6-Seater Meeting Room', description: 'Ideal for team meetings and presentations. (Expandable to 8 seats, extra charges apply).' },
            { name: '12 Workstations', description: 'Flexible seating in a collaborative open-plan area.' },
            { name: 'High-speed Internet', description: 'Fast and reliable WiFi for all your needs.' },
            { name: 'Printing', description: 'Printing services available at a nominal cost.' },
            { name: 'Onsite Staff', description: 'Our team is here to assist you during office hours.' },
          ],
        },
        {
            category: 'Lifestyle & Recreation',
            items: [
                { name: 'Pantry', description: 'Includes tea & coffee facilities.' },
                { name: 'Breakout Space', description: 'A casual space to unwind and connect with others.' },
                { name: 'Air Conditioned', description: 'Comfortable temperature year-round.' },
                { name: 'Cleaning Services', description: 'Regular cleaning to ensure a pristine environment.'},
                { name: 'Parking', description: 'On-site parking available at owner\'s risk.'},
            ]
        }
      ],
      rules: [
        'Access from 8:00 AM to 6:00 PM.',
        'Please be mindful of noise levels in the open-plan areas.',
      ],
      gallery: [
        {
          id: 'olive-gallery-all',
          title: 'Our Space',
          imageUrls: [
            'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-1.jpg',
            'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-6.jpg',
            'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-10.jpg',
            'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-5.jpg',
            'https://maplindia.com/wp-content/uploads/2021/10/Development-Solutions-Office-Interiors-8.jpg',
          ]
        }
      ]
    }
  }
];
