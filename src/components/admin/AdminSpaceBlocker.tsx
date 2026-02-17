'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { format, startOfDay } from 'date-fns';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { allResources } from '@/lib/resources';
import type { Workspace, AdminReservation } from '@/lib/definitions';
import { offices } from '@/lib/offices';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSpaceBlocker() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(offices[0].id);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [adminBlocks, setAdminBlocks] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const fetchAdminBlocks = useCallback(() => {
    if (!firestore || !date || !selectedOfficeId) {
        setLoading(false);
        return;
    }
    setLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');

    const q = query(
      collection(firestore, 'adminReservations'),
      where('officeId', '==', selectedOfficeId),
      where('date', '==', dateStr)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminReservation));
      setAdminBlocks(blocks);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching admin blocks: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch reservations.' });
        setLoading(false);
    });

    return unsubscribe;
  }, [firestore, date, selectedOfficeId, toast]);

  useEffect(() => {
    const unsubscribe = fetchAdminBlocks();
    return () => unsubscribe?.();
  }, [fetchAdminBlocks]);

  const handleToggleReservation = async (workspace: Workspace) => {
    if (!firestore || !date) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingBlock = adminBlocks.find(block => block.workspaceId === workspace.id);

    try {
      if (existingBlock) {
        // Unreserve - find the specific document to delete
        const q = query(
            collection(firestore, 'adminReservations'),
            where('workspaceId', '==', workspace.id),
            where('date', '==', dateStr),
            where('officeId', '==', selectedOfficeId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            await deleteDoc(docRef);
            toast({ title: 'Unreserved', description: `${workspace.name} is now available.` });
        }
      } else {
        // Reserve
        await addDoc(collection(firestore, 'adminReservations'), {
          officeId: selectedOfficeId,
          workspaceId: workspace.id,
          date: dateStr,
          workspaceType: workspace.type,
          createdAt: serverTimestamp()
        });
        toast({ title: 'Reserved', description: `${workspace.name} has been blocked for the day.` });
      }
    } catch (error: any) {
        console.error("Error toggling reservation: ", error);
        toast({ variant: 'destructive', title: 'Operation Failed', description: error.message });
    }
  };
  
  const resourcesForOffice = allResources.filter(r => r.officeId === selectedOfficeId);
  const workstations = resourcesForOffice.filter(r => r.type === 'desk');
  const rooms = resourcesForOffice.filter(r => r.type === 'room');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label>Select Office</Label>
          <Select value={selectedOfficeId} onValueChange={setSelectedOfficeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an office" />
            </SelectTrigger>
            <SelectContent>
              {offices.map(office => (
                <SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label>Select Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => { setDate(day); setCalendarOpen(false); }}
                initialFocus
                disabled={(day) => day < startOfDay(new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Meeting & Conference Rooms</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {rooms.map(room => {
                        const isBlocked = adminBlocks.some(b => b.workspaceId === room.id);
                        return (
                            <div key={room.id} className="flex items-center justify-between p-2 border rounded-md">
                                <span className="font-medium">{room.name}</span>
                                <Button
                                    size="sm"
                                    variant={isBlocked ? 'destructive' : 'outline'}
                                    onClick={() => handleToggleReservation(room)}
                                >
                                    {isBlocked ? 'Unreserve' : 'Reserve Full Day'}
                                </Button>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Workstations</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {workstations.map(ws => {
                        const isBlocked = adminBlocks.some(b => b.workspaceId === ws.id);
                        return (
                            <div key={ws.id} className="flex items-center justify-between p-2 border rounded-md">
                                <span className="font-medium">{ws.name.replace('Workstation ', 'WS ')}</span>
                                <Button
                                    size="sm"
                                    variant={isBlocked ? 'destructive' : 'outline'}
                                    onClick={() => handleToggleReservation(ws)}
                                >
                                    {isBlocked ? 'X' : 'Block'}
                                </Button>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
