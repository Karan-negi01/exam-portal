"use client";

import { useState } from "react";
import FormShell from "@/components/site/FormShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { applyForCenter } from "@/actions/centers";
import { PRICE_PER_SEAT, formatRupees } from "@/lib/pricing";
import { formatDate } from "@/lib/ids";
import styles from "./page.module.css";

const OTHER_LABEL = "Other";

const COURSE_TYPES = [
  "Computer Typing & Tally",
  "Basic Computer Course (CCC)",
  "Spoken English & Soft Skills",
  "Tailoring & Fashion Design",
  "Beautician & Cosmetology",
  "Data Entry Operator",
  "Accounting & Taxation",
  OTHER_LABEL,
];

const EMPTY = {
  name: "",
  ownerName: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  courseTypes: [],
  otherCourseType: "",
  seats: 10,
};

const PAYMENT_WHATSAPP_NUMBER = "919311444193";

function buildWhatsappMessage({ name, ownerName, phone, email, location, courseTypes, seats, amount }) {
  const lines = [
    "New Skorex center application",
    "",
    `Center: ${name}`,
    `Owner: ${ownerName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Location: ${location}`,
    `Courses: ${courseTypes.join(", ")}`,
    `Seats: ${seats} (${formatRupees(amount)})`,
    "",
    "Please share the payment QR so my application can be approved.",
  ];
  return `https://wa.me/${PAYMENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ApplyPage() {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [paying, setPaying] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCourseType(type) {
    setForm((f) => ({
      ...f,
      courseTypes: f.courseTypes.includes(type)
        ? f.courseTypes.filter((t) => t !== type)
        : [...f.courseTypes, type],
    }));
  }

  const amount = Math.max(0, Number(form.seats) || 0) * PRICE_PER_SEAT;

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Center name is required.";
    if (!form.ownerName.trim()) next.ownerName = "Owner name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (form.courseTypes.length === 0) next.courseTypes = "Select at least one course type.";
    if (form.courseTypes.includes(OTHER_LABEL) && !form.otherCourseType.trim()) {
      next.otherCourseType = "Tell us what kind of center this is.";
    }
    if (!form.seats || form.seats < 1) next.seats = "Choose at least 1 seat.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const finalCourseTypes = form.courseTypes.map((c) =>
      c === OTHER_LABEL ? form.otherCourseType.trim() : c
    );

    setPaying(true);
    const result = await applyForCenter(
      {
        ...form,
        courseTypes: finalCourseTypes,
        seats: Number(form.seats),
        panCardName: fileName || null,
      },
      file
    );
    setPaying(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setSubmitted({
      ...result.center,
      whatsappUrl: buildWhatsappMessage({
        name: form.name,
        ownerName: form.ownerName,
        phone: form.phone,
        email: form.email,
        location: form.location,
        courseTypes: finalCourseTypes,
        seats: Number(form.seats),
        amount,
      }),
    });
  }

  if (submitted) {
    return (
      <FormShell maxWidth="520px">
        <Card>
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>Application submitted</h1>
            <p className={styles.successText}>
              Thanks, {submitted.ownerName.split(" ")[0]}! Send us your details on WhatsApp below —
              we&apos;ll share a payment QR for your Seat Pack. Once paid, our admin team approves
              your center and you can start enrolling students.
            </p>
            <div className={styles.successCard}>
              <div className={styles.successRow}>
                <span>Login email</span>
                <span>{submitted.email}</span>
              </div>
              <div className={styles.successRow}>
                <span>Seat Pack</span>
                <span>
                  {submitted.quota.seats} seats · {formatRupees(submitted.quota.seats * PRICE_PER_SEAT)}
                </span>
              </div>
              <div className={styles.successRow}>
                <span>Status</span>
                <span>Awaiting payment &amp; approval</span>
              </div>
            </div>
            <Button
              href={submitted.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              block
              style={{ background: "#25D366", borderColor: "#25D366" }}
            >
              Send details on WhatsApp →
            </Button>
            <Button href="/login" variant="secondary" block style={{ marginTop: 10 }}>
              Go to login
            </Button>
          </div>
        </Card>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="List your center on Skorex"
      subtitle="Tell us about your center. Our admin team verifies every application."
      maxWidth="560px"
    >
      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          {formError && <div className={styles.formError}>{formError}</div>}

          <Field label="Center name" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Bright Academy"
            />
          </Field>

          <div className={styles.row2}>
            <Field label="Owner full name" error={errors.ownerName}>
              <Input
                value={form.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </Field>
          </div>

          <div className={styles.row2}>
            <Field label="Login email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@center.com"
              />
            </Field>
            <Field label="Set a password" error={errors.password} hint="Min. 6 characters">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>

          <Field label="Location (city, state)" error={errors.location}>
            <Input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Pune, Maharashtra"
            />
          </Field>

          <Field label="Course / center types" error={errors.courseTypes} hint="Select all that apply">
            <div className={styles.chipGrid}>
              {COURSE_TYPES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`${styles.chip} ${form.courseTypes.includes(c) ? styles.chipActive : ""}`}
                  onClick={() => toggleCourseType(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          {form.courseTypes.includes(OTHER_LABEL) && (
            <Field label="What kind of center is it?" error={errors.otherCourseType}>
              <Input
                value={form.otherCourseType}
                onChange={(e) => update("otherCourseType", e.target.value)}
                placeholder="e.g. Yoga & Wellness Training"
                autoFocus
              />
            </Field>
          )}

          <Field label="PAN card (business proof)" hint="Optional for now">
            <label className={styles.fileBox}>
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  setFileName(f?.name || "");
                }}
              />
              {fileName ? (
                <div className={styles.fileName}>📎 {fileName}</div>
              ) : (
                <div className={styles.fileHint}>Click to upload your PAN card (PDF/JPG/PNG)</div>
              )}
            </label>
          </Field>

          <Field label="Seat Pack — how many students?" error={errors.seats} hint="₹200 per student · valid for 1 year">
            <Input
              type="number"
              min="1"
              value={form.seats}
              onChange={(e) => update("seats", e.target.value)}
            />
          </Field>

          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>
              {form.seats || 0} seats × {formatRupees(PRICE_PER_SEAT)}
            </span>
            <span className={styles.priceValue}>{formatRupees(amount)}</span>
          </div>

          <Button type="submit" size="lg" block disabled={paying}>
            {paying ? "Submitting…" : "Submit application"}
          </Button>

          <p className={styles.footNote}>
            After submitting, send us your details on WhatsApp and we&apos;ll share a payment QR.
          </p>

          <p className={styles.footNote}>
            Already listed? <a href="/login">Log in instead</a>
          </p>
        </form>
      </Card>
    </FormShell>
  );
}
