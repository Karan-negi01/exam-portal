"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Field, Input } from "@/components/ui/Field";
import SeatStatusCard from "@/components/center/SeatStatusCard";
import BuySeatsModal from "@/components/center/BuySeatsModal";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { addStudent, removeStudent } from "@/lib/store";
import { sendStudentCredentialsSms } from "@/lib/notify";
import { seatsRemaining } from "@/lib/pricing";
import { formatDate, getInitials } from "@/lib/ids";
import styles from "./page.module.css";

export default function CenterStudentsPage() {
  const { session } = useAuth();
  const db = useDB();
  const centerId = session?.centerId;
  const center = db.centers.find((c) => c.id === centerId);
  const students = db.students.filter((s) => s.centerId === centerId);
  const remaining = center ? seatsRemaining(center.quota, students.length) : 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [buyingSeats, setBuyingSeats] = useState(false);
  const [justAdded, setJustAdded] = useState(null);
  const [removingStudent, setRemovingStudent] = useState(null);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visibleStudents = query
    ? students.filter((s) =>
        [s.name, s.phone, s.studentCode].some((field) => (field || "").toLowerCase().includes(query))
      )
    : students;

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Students"
      subtitle="Every enrolled student logs in with their phone number and a password."
      actions={
        <Button size="sm" onClick={() => setModalOpen(true)}>
          + Add student
        </Button>
      }
    >
      {center && (
        <SeatStatusCard
          center={center}
          usedSeats={students.length}
          onPurchased={(seats) =>
            setJustAdded({ seatsPurchased: seats })
          }
        />
      )}

      {justAdded?.seatsPurchased && (
        <div className={styles.successBanner}>
          <span>✓ {justAdded.seatsPurchased} seats added to your quota.</span>
          <Button size="sm" variant="ghost" onClick={() => setJustAdded(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {justAdded?.studentCode && (
        <div className={styles.successBanner}>
          <span>
            ✓ {justAdded.name} added — login is <b>{justAdded.phone}</b> + password{" "}
            <b>{justAdded.password}</b>.{" "}
            {justAdded.smsSent ? "Sent to their phone via SMS (demo)." : ""}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setJustAdded(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {students.length > 0 && (
        <Input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or student ID…"
        />
      )}

      <Card padding="none">
        {students.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No students enrolled yet"
            description="Add your first student to issue them an exam login."
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                Add student
              </Button>
            }
          />
        ) : visibleStudents.length === 0 ? (
          <EmptyState icon="🔍" title="No students match your search" />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Phone (login)</th>
                  <th>Password</th>
                  <th>Enrolled</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((s) => (
                  <tr key={s.id}>
                    <td className={styles.code}>{s.studentCode}</td>
                    <td className={styles.nameCell}>
                      <Link href={`/center/students/${s.id}`} className={styles.nameWrap}>
                        <span className={styles.avatar}>{getInitials(s.name)}</span>
                        {s.name}
                      </Link>
                    </td>
                    <td>{s.phone}</td>
                    <td>
                      <span className={styles.password}>{s.password}</span>
                    </td>
                    <td>{formatDate(s.createdAt)}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={() => setRemovingStudent(s)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modalOpen && (
        <AddStudentModal
          centerId={centerId}
          remainingSeats={remaining}
          onClose={() => setModalOpen(false)}
          onAdded={(student) => {
            setJustAdded(student);
            setModalOpen(false);
          }}
          onBuySeats={() => {
            setModalOpen(false);
            setBuyingSeats(true);
          }}
        />
      )}

      {buyingSeats && (
        <BuySeatsModal
          centerId={centerId}
          onClose={() => setBuyingSeats(false)}
          onPurchased={(seats) => {
            setBuyingSeats(false);
            setJustAdded({ seatsPurchased: seats });
          }}
        />
      )}

      {removingStudent && (
        <ConfirmDialog
          title="Remove student"
          message={`Remove ${removingStudent.name} from your center? They'll no longer be able to log in.`}
          confirmLabel="Remove"
          tone="danger"
          onConfirm={() => {
            removeStudent(removingStudent.id);
            setRemovingStudent(null);
          }}
          onCancel={() => setRemovingStudent(null)}
        />
      )}
    </DashboardShell>
  );
}

function AddStudentModal({ centerId, remainingSeats, onClose, onAdded, onBuySeats }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (remainingSeats <= 0) {
    return (
      <Modal title="No seats remaining" onClose={onClose}>
        <p style={{ color: "var(--color-ink-soft)", fontSize: "0.92rem", marginBottom: 20, lineHeight: 1.6 }}>
          You&apos;ve used every seat in your current Seat Pack. Buy another Seat Pack to enroll
          more students.
        </p>
        <Button block onClick={onBuySeats}>
          Buy a Seat Pack
        </Button>
      </Modal>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Student name is required.");
    if (!phone.trim()) return setError("Phone number is required — students log in with it.");
    const result = addStudent(centerId, { name: name.trim(), phone: phone.trim() });
    if (!result.ok) return setError(result.error);
    const sms = sendStudentCredentialsSms(result.student);
    onAdded({ ...result.student, smsSent: sms.ok });
  }

  return (
    <Modal title="Add a student" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>{error}</div>}
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student's full name" autoFocus />
        </Field>
        <Field label="Phone number" hint="Required — this is how they'll log in">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
        </Field>
        <Button type="submit" block>
          Add student
        </Button>
      </form>
    </Modal>
  );
}
