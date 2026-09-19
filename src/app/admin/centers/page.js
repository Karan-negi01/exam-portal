"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Field";
import DataState from "@/components/ui/DataState";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { approveCenter, rejectCenter, suspendCenter, reinstateCenter } from "@/actions/centers";
import { formatDate } from "@/lib/ids";
import styles from "./page.module.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "suspended", label: "Suspended" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_TONE = { pending: "warning", approved: "success", suspended: "warning", rejected: "danger" };

export default function AdminCentersPage() {
  const { data: db, loading, error, refresh } = useAsyncData(getFullDb);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [suspending, setSuspending] = useState(null);

  async function handleApprove(id) {
    await approveCenter(id);
    refresh();
  }
  async function handleReject(id) {
    await rejectCenter(id);
    refresh();
  }
  async function handleReinstate(id) {
    await reinstateCenter(id);
    refresh();
  }
  async function handleConfirmSuspend() {
    if (!suspending) return;
    await suspendCenter(suspending.id);
    setSuspending(null);
    refresh();
  }

  if (loading || error || !db) {
    return (
      <DashboardShell
        navItems={ADMIN_NAV}
        roleTag="Platform admin"
        userMeta="Full platform access"
        title="Centers"
        subtitle="Every center that has applied to list on Skorex."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const byStatus = filter === "all" ? db.centers : db.centers.filter((c) => c.status === filter);
  const query = search.trim().toLowerCase();
  const centers = query
    ? byStatus.filter((c) =>
        [c.name, c.ownerName, c.email, c.location].some((field) =>
          (field || "").toLowerCase().includes(query)
        )
      )
    : byStatus;

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Centers"
      subtitle="Every center that has applied to list on Skorex."
    >
      <div className={styles.toolbar}>
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
        <Input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, owner, email or location…"
        />
      </div>

      <Card padding="none">
        {centers.length === 0 ? (
          <EmptyState
            icon="🏫"
            title="No centers here"
            description={query ? "Nothing matches your search." : "Nothing matches this filter yet."}
          />
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
                          <Button size="sm" variant="danger" onClick={() => handleReject(c.id)}>
                            Reject
                          </Button>
                          <Button size="sm" variant="primary" onClick={() => handleApprove(c.id)}>
                            Approve
                          </Button>
                        </div>
                      )}
                      {c.status === "approved" && (
                        <div className={styles.actionsCell}>
                          <Button size="sm" variant="danger" onClick={() => setSuspending(c)}>
                            Suspend
                          </Button>
                        </div>
                      )}
                      {c.status === "suspended" && (
                        <div className={styles.actionsCell}>
                          <Button size="sm" variant="primary" onClick={() => handleReinstate(c.id)}>
                            Reinstate
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

      {suspending && (
        <ConfirmDialog
          title="Suspend center"
          message={`Suspend "${suspending.name}"? The owner and their students won't be able to log in until you reinstate them.`}
          confirmLabel="Suspend"
          tone="danger"
          onConfirm={handleConfirmSuspend}
          onCancel={() => setSuspending(null)}
        />
      )}
    </DashboardShell>
  );
}
