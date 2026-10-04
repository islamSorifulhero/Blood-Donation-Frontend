"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScheduleDonation } from "@/hooks/use-donations";

export function ScheduleDonationDialog({ requestMatchId, patientName }: { requestMatchId: string; patientName: string }) {
  const [open, setOpen] = useState(false);
  const [donationDate, setDonationDate] = useState("");
  const [location, setLocation] = useState("");
  const scheduleDonation = useScheduleDonation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="success">
          Schedule donation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule your donation</DialogTitle>
          <DialogDescription>For {patientName}&rsquo;s request.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date &amp; time</Label>
            <Input type="datetime-local" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Location (optional)</Label>
            <Input placeholder="e.g. hospital blood bank" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            loading={scheduleDonation.isPending}
            disabled={!donationDate}
            onClick={() => {
              scheduleDonation.mutate(
                { requestMatchId, donationDate: new Date(donationDate).toISOString(), location: location || undefined },
                { onSuccess: () => setOpen(false) }
              );
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
