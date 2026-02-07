import type { Space } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const mainOfficeImage = PlaceHolderImages.find((img) => img.id === 'main-office-hub-hero');

export const spacesData: Space[] = [
  {
    slug: 'main-office-hub',
    name: 'Main Office – Co-working Hub',
    description: 'Our flagship location with a full suite of amenities designed for productivity and collaboration.',
    keyAmenities: ['Conference Room', 'Workstations', 'Gaming Zone'],
    imageUrl: mainOfficeImage?.imageUrl || '',
    imageHint: mainOfficeImage?.imageHint || 'stylish office',
    status: 'available',
    details: {
      overview: "Welcome to our premier co-working destination. The Main Office Hub is more than just a place to work; it's a community of professionals and a center for innovation. With state-of-the-art facilities and a vibrant atmosphere, it's the perfect environment to grow your business.",
      amenities: [
        {
          category: 'Work & Meeting',
          items: [
            { name: 'Conference Room', description: 'A large, fully-equipped room for up to 12 people.' },
            { name: 'Meeting Room', description: 'A smaller, private room for up to 6 people.' },
            { name: '12 Individual Workstations', description: 'Ergonomic desks for focused work.' },
            { name: 'High-Speed Internet', description: 'Blazing fast fiber internet.' },
          ],
        },
        {
            category: 'Lifestyle & Recreation',
            items: [
                { name: 'Gaming Zone', description: 'Challenge a colleague to a game of Carrom or choose from a selection of board games. Note: Games are exclusive to this location.' },
                { name: 'Pantry', description: 'Unlimited premium coffee, tea, and snacks.' },
                { name: 'Breakout Areas', description: 'Comfortable lounges to relax and network.' },
            ]
        }
      ],
      rules: [
        'Amenities and offerings vary by location.',
        'Bookings and pricing may differ by space.',
        'Games are available only at select spaces like this one.',
        'Please respect the shared environment and clean up after yourself.',
        'External food is allowed in designated pantry areas only.'
      ]
    }
  }
];
