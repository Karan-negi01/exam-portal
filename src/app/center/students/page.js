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
import DataState from "@/components/ui/DataState";
import { Field, Input } from "@/components/ui/Field";
import SeatStatusCard from "@/components/center/SeatStatusCard";
import BuySeatsModal from "@/components/center/BuySeatsModal";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { addStudent, removeStudent, resetStudentPassword } from "@/actions/students";
import { sendStudentCredentialsSms } from "@/lib/notify";
import { sendStudentCredentialsEmail } from "@/actions/notify";
import { seatsRemaining } from "@/lib/pricing";
import { formatDate, getInitials } from "@/lib/ids";
import styles from "./page.module.css";

// Emails credentials when the student has an email on file (real delivery via
// Resend); otherwise falls back to the simulated SMS the demo has always used.
async function deliverCredentials(student, centerName) {
  if (student.email) {
    const result = await sendStudentCredentialsEmail(student, centerName || "your center");
    return { emailSent: result.ok, emailError: result.ok ? null : result.error };
  }
  const sms = await sendStudentCredentialsSms(student);
  return { smsSent: sms.ok };
}

export default function CenterStudentsPage() {
  const { session } = useAuth();
  const { data: db, loading, error, refresh } = useAsyncData(getFullDb);
  const centerId = session?.centerId;

  const [modalOpen, setModalOpen] = useState(false);
  const [buyingSeats, setBuyingSeats] = useState(false);
  const [justAdded, setJustAdded] = useState(null);
  const [removingStudent, setRemovingStudent] = useState(null);
  const [resettingStudent, setResettingStudent] = useState(null);
  const [search, setSearch] = useState("");

  if (loading || error || !db) {
    return (
      <DashboardShell
        navItems={CENTER_NAV}
        roleTag="Center owner"
        userMeta={session?.name}
        title="Students"
        subtitle="Every enrolled student logs in with their phone number and a password."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const center = db.centers.find((c) => c.id === centerId);
  const students = db.students.filter((s) => s.centerId === centerId);
  const remaining = center ? seatsRemaining(center.quota, students.length) : 0;

  async function handleRemoveConfirm() {
    if (!removingStudent) return;
    await removeStudent(removingStudent.id);
    setRemovingStudent(null);
    refresh();
  }

  async function handleResetPassword(student) {
    setResettingStudent(student.id);
    const result = await resetStudentPassword(student.id);
    setResettingStudent(null);
    if (!result.ok) return;
    const delivered = await deliverCredentials(result.student, center?.name);
    setJustAdded({ ...result.student, ...delivered, reset: true });
  }

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
          onPurchased={(seats) => {
            setJustAdded({ seatsPurchased: seats });
            refresh();
          }}
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
            ✓ {justAdded.reset ? `${justAdded.name}'s password reset` : `${justAdded.name} added`} —
            login is <b>{justAdded.phone}</b> + password <b>{justAdded.password}</b>.{" "}
            {justAdded.emailSent
              ? `Emailed to ${justAdded.email}.`
              : justAdded.emailError
                ? `Couldn't email it (${justAdded.emailError}) — share it manually.`
                : justAdded.smsSent
                  ? "Sent to their phone via SMS (demo)."
                  : ""}
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
                    <td>{formatDate(s.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResetPassword(s)}
                          disabled={resettingStudent === s.id}
                        >
                          {resettingStudent === s.id ? "Resetting…" : "Reset password"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRemovingStudent(s)}>
                          Remove
                        </Button>
                      </div>
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
          centerName={center?.name}
          remainingSeats={remaining}
          onClose={() => setModalOpen(false)}
          onAdded={(student) => {
            setJustAdded(student);
            setModalOpen(false);
            refresh();
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
            refresh();
          }}
        />
      )}

      {removingStudent && (
        <ConfirmDialog
          title="Remove student"
          message={`Remove ${removingStudent.name} from your center? They'll no longer be able to log in.`}
          confirmLabel="Remove"
          tone="danger"
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemovingStudent(null)}
        />
      )}
    </DashboardShell>
  );
}

function AddStudentModal({ centerId, centerName, remainingSeats, onClose, onAdded, onBuySeats }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Student name is required.");
    if (!phone.trim()) return setError("Phone number is required — students log in with it.");
    const result = await addStudent(centerId, {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
    });
    if (!result.ok) return setError(result.error);
    const delivered = await deliverCredentials(result.student, centerName);
    onAdded({ ...result.student, ...delivered });
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
        <Field label="Email" hint="Optional — if given, their login is emailed to them automatically">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
          />
        </Field>
        <Button type="submit" block>
          Add student
        </Button>
      </form>
    </Modal>
  );
}
