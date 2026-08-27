"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { Field, Input } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { addStudent, removeStudent } from "@/lib/store";
import { formatDate, getInitials } from "@/lib/ids";
import styles from "./page.module.css";

export default function CenterStudentsPage() {
  const { session } = useAuth();
  const db = useDB();
  const centerId = session?.centerId;
  const students = db.students.filter((s) => s.centerId === centerId);

  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);
  const [removingStudent, setRemovingStudent] = useState(null);

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Students"
      subtitle="Every enrolled student gets an individual login ID and password."
      actions={
        <Button size="sm" onClick={() => setModalOpen(true)}>
          + Add student
        </Button>
      }
    >
      {justAdded && (
        <div className={styles.successBanner}>
          <span>
            ✓ {justAdded.name} added — Student ID <b>{justAdded.studentCode}</b>, password{" "}
            <b>{justAdded.password}</b>. Share these with your student.
          </span>
          <Button size="sm" variant="ghost" onClick={() => setJustAdded(null)}>
            Dismiss
          </Button>
        </div>
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
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Password</th>
                  <th>Enrolled</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className={styles.code}>{s.studentCode}</td>
                    <td className={styles.nameCell}>
                      <div className={styles.nameWrap}>
                        <span className={styles.avatar}>{getInitials(s.name)}</span>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.phone || "—"}</td>
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
          onClose={() => setModalOpen(false)}
          onAdded={(student) => {
            setJustAdded(student);
            setModalOpen(false);
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

function AddStudentModal({ centerId, onClose, onAdded }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Student name is required.");
    const student = addStudent(centerId, { name: name.trim(), phone: phone.trim() });
    onAdded(student);
  }

  return (
    <Modal title="Add a student" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>{error}</div>}
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student's full name" autoFocus />
        </Field>
        <Field label="Phone number" hint="Optional">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
        </Field>
        <Button type="submit" block>
          Add student
        </Button>
      </form>
    </Modal>
  );
}
