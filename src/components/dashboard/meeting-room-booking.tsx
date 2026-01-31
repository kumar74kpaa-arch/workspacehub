'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Workspace } from '@/lib/definitions';

interface MeetingRoomBookingProps {
    rooms: Workspace[];
}

export function MeetingRoomBooking({ rooms }: MeetingRoomBookingProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [selectedRoom, setSelectedRoom] = React.useState<string | undefined>(rooms[0]?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Reserve Meeting Room</CardTitle>
        <CardDescription>Book a meeting room by the hour for your team.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Select Room</Label>
            <Select onValueChange={setSelectedRoom} defaultValue={selectedRoom}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a meeting room" />
                </SelectTrigger>
                <SelectContent>
                    {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                            {room.name} (up to {room.capacity} people)
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="date">Select Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="start-time" 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10" 
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="end-time" 
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto ml-auto">Reserve Room</Button>
      </CardFooter>
    </Card>
  );
}
