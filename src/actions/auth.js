"use server";

import bcrypt from "bcryptjs";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { normalizePhone } from "@/lib/ids";

export async function loginAdmin(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    return { ok: true };
  }
  return { ok: false, error: "Invalid admin email or password." };
}

export async function loginCenter(email, password) {
  const supabase = getSupabaseServerClient();
  const { data: center, error } = await supabase
    .from("centers")
    .select("id, name, status, password_hash")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!center) return { ok: false, error: "Invalid email or password." };

  const matches = await bcrypt.compare(password, center.password_hash);
  if (!matches) return { ok: false, error: "Invalid email or password." };
  if (center.status === "pending") {
    return { ok: false, error: "Your center is still awaiting admin approval." };
  }
  if (center.status === "rejected") {
    return { ok: false, error: "Your center application was not approved." };
  }
  if (center.status === "suspended") {
    return { ok: false, error: "Your center has been suspended. Contact CertifyHub support." };
  }
  return { ok: true, center: { id: center.id, name: center.name } };
}

export async function loginStudent(centerId, phone, password) {
  const supabase = getSupabaseServerClient();

  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id, name, status")
    .eq("id", centerId)
    .maybeSingle();
  if (centerError) throw new Error(centerError.message);
  if (!center) return { ok: false, error: "Please select your center." };
  if (center.status === "suspended") {
    return { ok: false, error: "This center's account is currently inactive." };
  }

  const { data: students, error } = await supabase
    .from("students")
    .select("id, name, phone, password_hash")
    .eq("center_id", centerId);
  if (error) throw new Error(error.message);

  const student = students.find((s) => normalizePhone(s.phone) === normalizePhone(phone));
  if (!student) return { ok: false, error: "Invalid phone number or password." };

  const matches = await bcrypt.compare(password, student.password_hash);
  if (!matches) return { ok: false, error: "Invalid phone number or password." };

  return {
    ok: true,
    student: { id: student.id, name: student.name },
    center: { id: center.id, name: center.name },
  };
}
