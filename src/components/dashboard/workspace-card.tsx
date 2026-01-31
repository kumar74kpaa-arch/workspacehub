import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Workspace } from '@/lib/definitions';
import { Users, Desk } from 'lucide-react';

type WorkspaceCardProps = {
  workspace: Workspace;
};

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={workspace.imageUrl}
          alt={workspace.name}
          width={400}
          height={200}
          className="object-cover aspect-[2/1] w-full"
          data-ai-hint={workspace.imageHint}
        />
        <Badge
          className="absolute top-2 right-2"
          variant={workspace.type === 'room' ? 'default' : 'secondary'}
        >
          {workspace.type === 'room' ? 'Meeting Room' : 'Hot Desk'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg truncate">{workspace.name}</h3>
        <div className="flex items-center text-muted-foreground text-sm mt-2">
          {workspace.type === 'room' ? <Users className="h-4 w-4 mr-2" /> : <Desk className="h-4 w-4 mr-2" />}
          <span>
            {workspace.type === 'room' ? `Up to ${workspace.capacity} people` : 'Single person desk'}
          </span>
        </div>
        <Button className="w-full mt-4">Book Now</Button>
      </CardContent>
    </Card>
  );
}
