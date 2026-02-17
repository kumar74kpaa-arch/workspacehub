'use client';

import { AdminSpaceBlocker } from '@/components/admin/AdminSpaceBlocker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminBlockerPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Reservation Blocker</CardTitle>
                <CardDescription>
                    Reserve or unreserve any resource for a full day. This will make it unavailable for user bookings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AdminSpaceBlocker />
            </CardContent>
        </Card>
    )
}
