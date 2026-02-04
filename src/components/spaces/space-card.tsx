import Image from 'next/image';
import Link from 'next/link';
import type { Space } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Card className="flex flex-col group">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
            <Image
                src={space.imageUrl}
                alt={space.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={space.imageHint}
            />
            {space.status === 'coming-soon' && (
                <Badge className="absolute top-3 right-3">Coming Soon</Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-xl mb-2">{space.name}</CardTitle>
        <CardDescription>{space.description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
            {space.keyAmenities.map(amenity => (
                <Badge key={amenity} variant="secondary">{amenity}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full font-semibold" disabled={space.status === 'coming-soon'}>
            <Link href={`/spaces/${space.slug}`}>
                View Details <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
