"use server";

import bcrypt from "bcryptjs";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { generatePassword, normalizePhone } from "@/lib/ids";
import { isQuotaExpired } from "@/lib/pricing";
import { mapStudent } from "./mappers";

export async function addStudent(centerId, { name, phone, email }) {
  const supabase = getSupabaseServerClient();

  if (!phone || !normalizePhone(phone)) {
    return { ok: false, error: "A phone number is required — students log in with it." };
  }

  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("code, seats, expires_at")
    .eq("id", centerId)
    .single();
  if (centerError || !center) return { ok: false, error: "Center not found." };

  const { data: existing, error: existingError } = await supabase
    .from("students")
    .select("id, phone")
    .eq("center_id", centerId);
  if (existingError) throw new Error(existingError.message);

  if (existing.some((s) => normalizePhone(s.phone) === normalizePhone(phone))) {
    return { ok: false, error: "A student with this phone number is already enrolled." };
  }
  if (isQuotaExpired({ expiresAt: center.expires_at })) {
    return { ok: false, error: "Your seat quota has expired. Buy more seats to keep enrolling students." };
  }
  if (existing.length >= center.seats) {
    return { ok: false, error: "You've used all your purchased seats. Buy more seats to add this student." };
  }

  const nextNumber = 1001 + existing.length;
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: row, error } = await supabase
    .from("students")
    .insert({
      center_id: centerId,
      student_code: `${center.code}-${nextNumber}`,
      name,
      phone,
      email: email || null,
      password_hash: passwordHash,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  return { ok: true, student: { ...mapStudent(row), password } };
}

export async function removeStudent(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function changeStudentPassword(studentId, currentPassword, newPassword) {
  const supabase = getSupabaseServerClient();
  const { data: student, error: fetchError } = await supabase
    .from("students")
    .select("password_hash")
    .eq("id", studentId)
    .single();
  if (fetchError || !student) return { ok: false, error: "Student not found." };

  const matches = await bcrypt.compare(currentPassword, student.password_hash);
  if (!matches) return { ok: false, error: "Current password is incorrect." };
  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: "New password must be at least 4 characters." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase
    .from("students")
    .update({ password_hash: passwordHash })
    .eq("id", studentId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Passwords are hashed now, so a center owner can no longer see a forgotten
// student's existing password the way the old plaintext demo table could --
// this issues a fresh one instead, same flow as adding a student.
export async function resetStudentPassword(studentId) {
  const supabase = getSupabaseServerClient();
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: row, error } = await supabase
    .from("students")
    .update({ password_hash: passwordHash })
    .eq("id", studentId)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, student: { ...mapStudent(row), password } };
}
