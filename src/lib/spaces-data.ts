import type { Space } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

export const spacesData: Space[] = [
  {
    slug: 'banyan',
    name: 'The Banyan',
    description: 'A premium workspace designed for focused professionals seeking an elevated, distraction-free environment.',
    keyAmenities: ['Premium Conference Room', 'Dedicated Workstations', 'Breakout Space'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'banyan-hero')?.imageUrl || '',
    imageHint: 'stylish office',
    status: 'available',
    details: {
      overview: "The Banyan is our flagship premium workspace, meticulously designed for focused professionals. It offers a sophisticated, serene environment with top-tier amenities. From the fully-equipped conference room to the comfortable breakout areas, every detail is crafted to enhance productivity and comfort. It's an ideal choice for teams and individuals who value a professional atmosphere.",
      amenities: [
        {
          category: 'Work & Meeting',
          items: [
            { name: 'Conference Room', description: '12-seater room with TV, Video Conferencing, and Whiteboard.' },
            { name: '16 Individual Workstations', description: 'Ergonomic chairs and spacious desks for focused work.' },
            { name: 'High-speed Internet', description: 'Reliable fiber optic connectivity.' },
            { name: 'Printing', description: 'On-demand printing services available (chargeable).' },
            { name: 'Onsite Staff', description: 'Support team available from 8AM to 6PM.' },
          ],
        },
        {
            category: 'Lifestyle & Comfort',
            items: [
                { name: 'Pantry', description: 'Access to tea & coffee. Branded water available (chargeable).' },
                { name: 'Breakout Space', description: 'A quiet zone to relax or have informal discussions.' },
                { name: 'Air Conditioned', description: 'Fully climate-controlled for your comfort.' },
                { name: 'Cleaning Services', description: 'Professionally maintained and sanitized daily.' },
                { name: 'Washrooms', description: 'Clean and modern facilities.'},
                { name: 'Parking', description: 'On-site parking available at owner\'s risk.'},
            ]
        }
      ],
      rules: [
        'Access from 8:00 AM to 6:00 PM. Extended hours available at extra charge.',
        'This space is strictly for professional use to maintain a focused environment.',
        'Additional seats in meeting rooms are chargeable.',
      ],
      gallery: [
        {
          id: 'banyan-gallery-meeting',
          title: 'Conference and Meeting Rooms',
          imageUrls: [
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-3.jpg',
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-4.jpg',
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-5.jpg',
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-6.jpg',
          ]
        },
        {
          id: 'banyan-gallery-workstation',
          title: 'Workstations',
          imageUrls: [
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-12.jpg',
            'https://maplindia.com/wp-content/uploads/2021/11/Miglanis-Associates-Office-New-Delhi-13.jpg',
          ]
        },
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
