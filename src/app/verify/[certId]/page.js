"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import FormShell from "@/components/site/FormShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import DataState from "@/components/ui/DataState";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { formatDate, toCertId } from "@/lib/ids";
import styles from "./page.module.css";

export default function VerifyCertificatePage({ params }) {
  const { certId } = use(params);
  const router = useRouter();
  const { data: db, loading, error } = useAsyncData(getFullDb);

  const [lookupValue, setLookupValue] = useState(certId || "");

  if (loading || error || !db) {
    return (
      <FormShell
        title="Certificate verification"
        subtitle="Check whether a CertifyHub certificate is genuine."
        maxWidth="480px"
      >
        <DataState loading={loading} error={error} />
      </FormShell>
    );
  }

  const normalized = (certId || "").toUpperCase();
  const attempt = db.attempts.find((a) => toCertId(a.id) === normalized);
  const exam = attempt && db.exams.find((e) => e.id === attempt.examId);
  const student = attempt && db.students.find((s) => s.id === attempt.studentId);
  const center = attempt && db.centers.find((c) => c.id === attempt.centerId);

  const found = Boolean(attempt && exam && student && center);
  const isGenuine = found && attempt.passed;

  function handleLookup(e) {
    e.preventDefault();
    const trimmed = lookupValue.trim();
    if (trimmed) router.push(`/verify/${trimmed.toUpperCase()}`);
  }

  return (
    <FormShell
      title="Certificate verification"
      subtitle="Check whether a CertifyHub certificate is genuine."
      maxWidth="480px"
    >
      <Card>
        <form onSubmit={handleLookup} className={styles.lookupForm}>
          <Field label="Certificate ID">
            <Input
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              placeholder="e.g. 3F9C2A1B"
            />
          </Field>
          <Button type="submit" block>
            Verify
          </Button>
        </form>
      </Card>

      {certId && (
        <Card className={styles.resultCard}>
          {isGenuine ? (
            <>
              <div className={styles.statusRow}>
                <span className={styles.statusIcon}>✅</span>
                <div>
                  <div className={styles.statusTitle}>Certificate verified</div>
                  <div className={styles.statusSub}>This is a genuine CertifyHub certificate.</div>
                </div>
              </div>
              <div className={styles.detailGrid}>
                <div>
                  <div className={styles.detailLabel}>Student</div>
                  <div className={styles.detailValue}>{student.name}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Exam</div>
                  <div className={styles.detailValue}>{exam.title}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Subject</div>
                  <div className={styles.detailValue}>{exam.subject}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Issued by</div>
                  <div className={styles.detailValue}>{center.name}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Date issued</div>
                  <div className={styles.detailValue}>{formatDate(attempt.submittedAt)}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>Certificate ID</div>
                  <div className={styles.detailValue}>{toCertId(attempt.id)}</div>
                </div>
              </div>
            </>
          ) : found ? (
            <div className={styles.statusRow}>
              <span className={styles.statusIcon}>⚠️</span>
              <div>
                <div className={styles.statusTitle}>No certificate issued</div>
                <div className={styles.statusSub}>
                  This attempt exists but didn&apos;t meet the passing marks, so no certificate was
                  issued for it.
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.statusRow}>
              <span className={styles.statusIcon}>❌</span>
              <div>
                <div className={styles.statusTitle}>Certificate not found</div>
                <div className={styles.statusSub}>
                  Double-check the certificate ID and try again.
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </FormShell>
  );
}
