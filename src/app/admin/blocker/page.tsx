'use client';

import { AdminSpaceBlocker } from '@/components/admin/AdminSpaceBlocker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminBlockerPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Availability & Blocked Slots</CardTitle>
                <CardDescription>
                    Manage inventory availability and block or unblock workstation or meeting room slots for private corporate bookings or maintenance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AdminSpaceBlocker />
            </CardContent>
        </Card>
    )
}
