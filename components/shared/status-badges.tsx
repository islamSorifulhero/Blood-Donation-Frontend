import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUS_LABELS, URGENCY_BADGE_VARIANT } from "@/lib/constants";
import type { RequestStatus, UrgencyLevel } from "@/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const variant =
    status === "FULFILLED"
      ? "success"
      : status === "CANCELLED" || status === "EXPIRED"
        ? "destructive"
        : "outline";
  return <Badge variant={variant}>{REQUEST_STATUS_LABELS[status] ?? status}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  return <Badge variant={URGENCY_BADGE_VARIANT[urgency]}>{urgency}</Badge>;
}
