"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BuySeatsModal from "./BuySeatsModal";
import { isQuotaExpired, seatsRemaining } from "@/lib/pricing";
import { formatDate } from "@/lib/ids";
import styles from "./SeatStatusCard.module.css";

export default function SeatStatusCard({ center, usedSeats, onPurchased }) {
  const [buying, setBuying] = useState(false);

  const quota = center?.quota;
  const total = quota?.seats || 0;
  const remaining = seatsRemaining(quota, usedSeats);
  const expired = isQuotaExpired(quota);
  const pct = total > 0 ? Math.min(100, Math.round((usedSeats / total) * 100)) : 0;

  return (
    <>
      <Card className={styles.card}>
        <div className={styles.row}>
          <div className={styles.left}>
            <span className={styles.icon}>🎟️</span>
            <div>
              <div className={styles.title}>
                {usedSeats} of {total} seats used
              </div>
              <div className={styles.subtitle}>
                {expired ? "Seat quota expired" : `Valid till ${formatDate(quota?.expiresAt)}`}
              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setBuying(true)}>
            + Buy Seat Pack
          </Button>
        </div>

        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${pct >= 100 ? styles.barFillFull : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className={styles.footNote}>₹200 per student · seats are valid for 1 year from purchase</div>

        {expired && (
          <div className={styles.expiredNote}>
            Your seat quota expired on {formatDate(quota?.expiresAt)}. Any unused seats were
            forfeited — buy more to keep enrolling students.
          </div>
        )}
        {!expired && remaining === 0 && (
          <div className={styles.expiredNote}>
            You&apos;ve used all your seats. Buy more to enroll additional students.
          </div>
        )}
      </Card>

      {buying && (
        <BuySeatsModal
          centerId={center.id}
          onClose={() => setBuying(false)}
          onPurchased={(seats) => {
            setBuying(false);
            onPurchased?.(seats);
          }}
        />
      )}
    </>
  );
}
