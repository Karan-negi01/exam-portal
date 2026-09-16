"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/ids";
import { formatRupees } from "@/lib/pricing";
import styles from "./CenterRequestCard.module.css";

export default function CenterRequestCard({ center, onApprove, onReject }) {
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
          <span className={styles.proof}>📎 {center.panCardName || "No PAN card uploaded"}</span>
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
