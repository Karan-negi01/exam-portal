"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import { useAsyncData } from "@/lib/useAsyncData";
import { computeAnalytics } from "@/actions/analytics";
import { formatRupees } from "@/lib/pricing";
import styles from "./page.module.css";

const STATUS_TONE = { approved: "success", pending: "warning", suspended: "warning", rejected: "danger" };

export default function AdminAnalyticsPage() {
  const { data: analytics, loading, error } = useAsyncData(computeAnalytics);

  if (loading || error || !analytics) {
    return (
      <DashboardShell
        navItems={ADMIN_NAV}
        roleTag="Platform admin"
        userMeta="Full platform access"
        title="Analytics"
        subtitle="Revenue, exam performance and center activity across the platform."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const maxScheduled = Math.max(1, ...analytics.popularPapers.map((p) => p.timesScheduled));

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Analytics"
      subtitle="Revenue, exam performance and center activity across the platform."
    >
      <div className={styles.stats}>
        <StatCard tone="green" icon="💰" value={formatRupees(analytics.totalRevenue)} label="Total revenue" />
        <StatCard tone="indigo" icon="🎯" value={`${analytics.passRate}%`} label="Overall pass rate" />
        <StatCard tone="blue" icon="📝" value={analytics.totalAttempts} label="Exams attempted" />
        <StatCard tone="amber" icon="⚠️" value={analytics.flaggedAttempts} label="Flagged for focus violations" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Most scheduled question papers</h2>
        </div>
        {analytics.popularPapers.length === 0 ? (
          <Card>
            <EmptyState icon="📚" title="No question papers yet" description="Create one to see it ranked here." />
          </Card>
        ) : (
          <Card>
            <div className={styles.paperList}>
              {analytics.popularPapers.map((p) => (
                <div className={styles.paperRow} key={p.id}>
                  <div className={styles.paperInfo}>
                    <div className={styles.paperTitle}>{p.title}</div>
                    <div className={styles.paperSubject}>
                      {p.subject} · {p.bankSize} question bank
                    </div>
                  </div>
                  <div className={styles.paperBarWrap}>
                    <div className={styles.paperBarTrack}>
                      <div
                        className={styles.paperBarFill}
                        style={{ width: `${(p.timesScheduled / maxScheduled) * 100}%` }}
                      />
                    </div>
                    <span className={styles.paperCount}>
                      {p.timesScheduled} time{p.timesScheduled === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Most-missed questions</h2>
        </div>
        {analytics.topMissedQuestions.length === 0 ? (
          <Card>
            <EmptyState
              icon="🎯"
              title="Not enough data yet"
              description="This fills in once students have attempted a few exams."
            />
          </Card>
        ) : (
          <Card padding="none">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Paper</th>
                    <th>Miss rate</th>
                    <th>Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topMissedQuestions.map((q) => (
                    <tr key={q.questionId}>
                      <td className={styles.questionText}>{q.text}</td>
                      <td>{q.paperTitle}</td>
                      <td>
                        <Badge tone={q.missRate >= 50 ? "danger" : "warning"}>{q.missRate}%</Badge>
                      </td>
                      <td>{q.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Center performance</h2>
        </div>
        {analytics.centerStats.length === 0 ? (
          <Card>
            <EmptyState icon="🏫" title="No centers yet" />
          </Card>
        ) : (
          <Card padding="none">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Center</th>
                    <th>Status</th>
                    <th>Students</th>
                    <th>Exams scheduled</th>
                    <th>Attempts</th>
                    <th>Pass rate</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.centerStats.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.name}</strong>
                      </td>
                      <td>
                        <Badge tone={STATUS_TONE[c.status] || "neutral"}>{c.status}</Badge>
                      </td>
                      <td>
                        {c.studentsEnrolled} / {c.seatsTotal}
                      </td>
                      <td>{c.examsScheduled}</td>
                      <td>{c.attempts}</td>
                      <td>{c.passRate === null ? "—" : `${c.passRate}%`}</td>
                      <td>{formatRupees(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
