"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import { Input } from "@/components/ui/Field";
import CertificateDownloadButton from "@/components/certificate/CertificateDownloadButton";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { formatDate, getInitials, toCertId } from "@/lib/ids";
import styles from "./page.module.css";

export default function CenterCertificatesPage() {
  const { session } = useAuth();
  const { data: db, loading, error } = useAsyncData(getFullDb);
  const centerId = session?.centerId;
  const [search, setSearch] = useState("");

  if (loading || error || !db) {
    return (
      <DashboardShell
        navItems={CENTER_NAV}
        roleTag="Center owner"
        userMeta={session?.name}
        title="Certificates"
        subtitle="Every certificate your students have earned, in one place."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const certificates = db.attempts
    .filter((a) => a.centerId === centerId && a.passed)
    .map((a) => {
      const exam = db.exams.find((e) => e.id === a.examId);
      const student = db.students.find((s) => s.id === a.studentId);
      return exam && student ? { attempt: a, exam, student } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.attempt.submittedAt) - new Date(a.attempt.submittedAt));

  const query = search.trim().toLowerCase();
  const visible = query
    ? certificates.filter((c) =>
        [c.student.name, c.exam.title, c.exam.subject].some((f) => (f || "").toLowerCase().includes(query))
      )
    : certificates;

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Certificates"
      subtitle="Every certificate your students have earned, in one place."
    >
      {certificates.length > 0 && (
        <Input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, exam or subject…"
        />
      )}

      {certificates.length === 0 ? (
        <Card>
          <EmptyState icon="🏅" title="No certificates yet" description="They'll show up here the moment a student passes an exam." />
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState icon="🔍" title="No certificates match your search" />
        </Card>
      ) : (
        <div className={styles.list}>
          {visible.map(({ attempt, exam, student }) => (
            <Card key={attempt.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.avatar}>{getInitials(student.name)}</span>
                <div>
                  <div className={styles.name}>{student.name}</div>
                  <div className={styles.meta}>
                    {exam.title} · {exam.subject} · Issued {formatDate(attempt.submittedAt)}
                  </div>
                </div>
              </div>
              <CertificateDownloadButton
                data={{
                  studentName: student.name,
                  examTitle: exam.title,
                  subject: exam.subject,
                  centerName: session?.name,
                  score: attempt.score,
                  totalMarks: attempt.totalMarks,
                  dateStr: formatDate(attempt.submittedAt),
                  certId: toCertId(attempt.id),
                }}
              />
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
