"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ReasonDialog({
  trigger,
  triggerVariant = "outline",
  title,
  description,
  confirmLabel,
  reasonRequired = false,
  loading,
  onConfirm,
}: {
  trigger: React.ReactNode;
  triggerVariant?: ButtonProps["variant"];
  title: string;
  description?: string;
  confirmLabel: string;
  reasonRequired?: boolean;
  loading?: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Textarea
          placeholder={reasonRequired ? "Reason (required)" : "Reason (optional)"}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={loading}
            disabled={reasonRequired && !reason.trim()}
            onClick={() => {
              onConfirm(reason.trim() || undefined as unknown as string);
              setOpen(false);
              setReason("");
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
