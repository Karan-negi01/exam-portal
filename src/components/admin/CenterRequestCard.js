"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/ids";
import { formatRupees } from "@/lib/pricing";
import { getPanCardUrl } from "@/actions/centers";
import styles from "./CenterRequestCard.module.css";

export default function CenterRequestCard({ center, onApprove, onReject }) {
  const [opening, setOpening] = useState(false);

  async function handleViewPanCard() {
    // Open the tab synchronously (on the click) so popup blockers don't
    // stop it -- we point it at the signed URL once the action resolves.
    const tab = window.open("", "_blank");
    setOpening(true);
    const result = await getPanCardUrl(center.id);
    setOpening(false);
    if (!result.ok) {
      if (tab) tab.close();
      return;
    }
    if (tab) {
      tab.opener = null;
      tab.location.href = result.url;
    }
  }

  return (
    <Card padding="none" className={styles.card}>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{center.name}</span>
          <Badge tone="warning">Pending review</Badge>
        </div>
        <div className={styles.meta}>
          <span>👤 {center.ownerName}</span>
          <span>📍 {center.location}</span>
          <span>📅 Applied {formatDate(center.createdAt)}</span>
        </div>
        <div className={styles.meta}>
          <span>✉️ {center.email}</span>
          <span>📞 {center.phone}</span>
        </div>
        <div className={styles.courseTags}>
          {center.courseTypes?.map((c) => (
            <span className={styles.courseTag} key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className={styles.meta}>
          {center.panCardPath ? (
            <button
              type="button"
              className={styles.proofLink}
              onClick={handleViewPanCard}
              disabled={opening}
            >
              📎 {opening ? "Opening…" : `View ${center.panCardName || "PAN card"}`}
            </button>
          ) : center.panCardName ? (
            <span className={styles.proof} title="Uploaded before file storage was wired up — no file on record">
              📎 {center.panCardName} (file unavailable)
            </span>
          ) : (
            <span className={styles.proof}>📎 No PAN card uploaded</span>
          )}
          <span>
            🎟️ {center.quota?.seats} seats · {formatRupees((center.quota?.seats || 0) * (center.quota?.pricePerSeat || 0))}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="danger" size="sm" onClick={() => onReject(center.id)}>
          Reject
        </Button>
        <Button variant="primary" size="sm" onClick={() => onApprove(center.id)}>
          Approve
        </Button>
      </div>
    </Card>
  );
}
