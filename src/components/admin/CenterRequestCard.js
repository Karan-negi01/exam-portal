"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { approveCenter, rejectCenter } from "@/lib/store";
import { formatDate } from "@/lib/ids";
import styles from "./CenterRequestCard.module.css";

export default function CenterRequestCard({ center }) {
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
          <span>🎓 {center.courseType}</span>
          <span>📅 Applied {formatDate(center.createdAt)}</span>
        </div>
        <div className={styles.meta}>
          <span>✉️ {center.email}</span>
          <span>📞 {center.phone}</span>
        </div>
        <span className={styles.proof}>📎 {center.businessProofName || "No document"}</span>
      </div>
      <div className={styles.actions}>
        <Button variant="danger" size="sm" onClick={() => rejectCenter(center.id)}>
          Reject
        </Button>
        <Button variant="primary" size="sm" onClick={() => approveCenter(center.id)}>
          Approve
        </Button>
      </div>
    </Card>
  );
}
