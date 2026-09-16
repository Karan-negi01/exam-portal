"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { STUDENT_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";
import { changeStudentPassword } from "@/actions/students";
import styles from "./page.module.css";

export default function StudentSettingsPage() {
  const { session } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    const result = await changeStudentPassword(session.id, currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password updated. Use your new password next time you log in.");
  }

  return (
    <DashboardShell
      navItems={STUDENT_NAV}
      roleTag="Student"
      userMeta={session?.centerName}
      title="Settings"
      subtitle="Manage your login."
    >
      <Card className={styles.card}>
        <h2 className={styles.sectionTitle}>Change password</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <Field label="Current password">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Field label="New password" hint="At least 4 characters">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm new password">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
