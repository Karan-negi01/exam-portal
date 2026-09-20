"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { addSeats } from "@/actions/centers";
import { PRICE_PER_SEAT, formatRupees } from "@/lib/pricing";
import styles from "./SeatStatusCard.module.css";

export default function BuySeatsModal({ centerId, onClose, onPurchased }) {
  const [seats, setSeats] = useState(10);
  const [paying, setPaying] = useState(false);

  const amount = Math.max(0, Number(seats) || 0) * PRICE_PER_SEAT;

  function handlePay(e) {
    e.preventDefault();
    if (!seats || seats < 1) return;
    setPaying(true);
    // No payment gateway wired up yet — this simulates a successful payment for the demo.
    setTimeout(async () => {
      await addSeats(centerId, Number(seats));
      setPaying(false);
      onPurchased(Number(seats));
    }, 600);
  }

  return (
    <Modal title="Buy a Seat Pack" onClose={onClose}>
      <form className={styles.form} onSubmit={handlePay}>
        <Field label="Additional seats" hint={`₹${PRICE_PER_SEAT} per student, valid for 1 year from purchase`}>
          <Input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
        </Field>

        <div className={styles.priceBox}>
          <span className={styles.priceLabel}>Total amount</span>
          <span className={styles.priceValue}>{formatRupees(amount)}</span>
        </div>

        <Button type="submit" block disabled={paying}>
          {paying ? "Processing…" : `Pay ${formatRupees(amount)} (demo)`}
        </Button>
      </form>
    </Modal>
  );
}
