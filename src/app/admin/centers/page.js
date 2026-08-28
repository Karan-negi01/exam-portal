"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useDB } from "@/lib/useDB";
import { approveCenter, rejectCenter } from "@/lib/store";
import { formatDate } from "@/lib/ids";
import styles from "./page.module.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_TONE = { pending: "warning", approved: "success", rejected: "danger" };

export default function AdminCentersPage() {
  const db = useDB();
  const [filter, setFilter] = useState("all");

  const centers =
    filter === "all" ? db.centers : db.centers.filter((c) => c.status === filter);

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Centers"
      subtitle="Every center that has applied to list on CertifyHub."
    >
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card padding="none">
        {centers.length === 0 ? (
          <EmptyState icon="🏫" title="No centers here" description="Nothing matches this filter yet." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Center</th>
                  <th>Location</th>
                  <th>Course types</th>
                  <th>Seat Pack</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {centers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.nameCell}>{c.name}</div>
                      <div className={styles.subCell}>{c.ownerName}</div>
                    </td>
                    <td>{c.location}</td>
                    <td>{c.courseTypes?.join(", ")}</td>
                    <td>{c.quota?.seats} seats</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td>
                      <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                    </td>
                    <td>
                      {c.status === "pending" && (
                        <div className={styles.actionsCell}>
                          <Button size="sm" variant="danger" onClick={() => rejectCenter(c.id)}>
                            Reject
                          </Button>
                          <Button size="sm" variant="primary" onClick={() => approveCenter(c.id)}>
                            Approve
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
