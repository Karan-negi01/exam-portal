"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormShell from "@/components/site/FormShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import styles from "./page.module.css";

const TABS = [
  { key: "center", label: "Center owner" },
  { key: "student", label: "Student" },
  { key: "admin", label: "Admin" },
];

export default function LoginPage() {
  const [tab, setTab] = useState("center");

  return (
    <FormShell title="Welcome back" subtitle="Log in to your CertifyHub dashboard" maxWidth="440px">
      <Card>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "center" && <CenterLoginForm />}
        {tab === "student" && <StudentLoginForm />}
        {tab === "admin" && <AdminLoginForm />}

        <p className={styles.footNote}>
          Don&apos;t have a center yet? <a href="/apply">List your center</a>
        </p>
      </Card>
    </FormShell>
  );
}

function CenterLoginForm() {
  const { loginCenter } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = await loginCenter(email, password);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    router.push("/center");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.formError}>{error}</div>}
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@brightacademy.com" />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </Field>
      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting ? "Logging in…" : "Log in"}
      </Button>
      <div className={styles.demoBox}>
        <b>Demo:</b> owner@brightacademy.com / center123
      </div>
    </form>
  );
}

function StudentLoginForm() {
  const { loginStudent } = useAuth();
  const router = useRouter();
  const { data: db } = useAsyncData(getFullDb);
  const centers = (db?.centers || []).filter((c) => c.status === "approved");
  const [centerId, setCenterId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!centerId) return setError("Please select your center.");
    setSubmitting(true);
    const result = await loginStudent(centerId, phone, password);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    router.push("/student");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.formError}>{error}</div>}
      <Field label="Your center">
        <Select value={centerId} onChange={(e) => setCenterId(e.target.value)}>
          <option value="">Select your center</option>
          {centers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Phone number">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98111 22334" />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </Field>
      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting ? "Logging in…" : "Log in"}
      </Button>
      <div className={styles.demoBox}>
        <b>Demo:</b> Bright Academy · +91 98111 22334 / K7M2QX
      </div>
    </form>
  );
}

function AdminLoginForm() {
  const { loginAdmin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = await loginAdmin(email, password);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    router.push("/admin");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.formError}>{error}</div>}
      <Field label="Admin email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@examplatform.com" />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </Field>
      <Button type="submit" block size="lg" disabled={submitting}>
        {submitting ? "Logging in…" : "Log in"}
      </Button>
      <div className={styles.demoBox}>
        <b>Demo:</b> admin@examplatform.com / admin123
      </div>
    </form>
  );
}
