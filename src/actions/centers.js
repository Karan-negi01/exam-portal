"use server";

import bcrypt from "bcryptjs";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { centerPrefix } from "@/lib/ids";
import { PRICE_PER_SEAT, oneYearFromNow } from "@/lib/pricing";
import { mapCenter } from "./mappers";

export async function applyForCenter(data) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(data.password, 10);

  const { data: row, error } = await supabase
    .from("centers")
    .insert({
      code: centerPrefix(data.name),
      name: data.name,
      owner_name: data.ownerName,
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone,
      location: data.location,
      course_types: data.courseTypes || [],
      pan_card_name: data.panCardName || null,
      status: "pending",
      created_at: now,
      seats: data.seats,
      price_per_seat: PRICE_PER_SEAT,
      purchased_at: now,
      expires_at: oneYearFromNow(now),
      revenue_collected: (data.seats || 0) * PRICE_PER_SEAT,
    })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "A center is already registered with this email." };
    }
    throw new Error(error.message);
  }
  return { ok: true, center: mapCenter(row) };
}

export async function addSeats(centerId, additionalSeats) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  const { data: center, error: fetchError } = await supabase
    .from("centers")
    .select("seats, revenue_collected")
    .eq("id", centerId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from("centers")
    .update({
      seats: (center.seats || 0) + additionalSeats,
      price_per_seat: PRICE_PER_SEAT,
      purchased_at: now,
      expires_at: oneYearFromNow(now),
      revenue_collected: (center.revenue_collected || 0) + additionalSeats * PRICE_PER_SEAT,
    })
    .eq("id", centerId);
  if (error) throw new Error(error.message);
}

export async function approveCenter(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("centers")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function rejectCenter(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("centers")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// Suspends a previously-approved center — blocks the owner and their students from
// logging in, and drops the center from the public "select your center" list, without
// losing their application/history the way rejecting a fresh application would imply.
export async function suspendCenter(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("centers").update({ status: "suspended" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reinstateCenter(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("centers").update({ status: "approved" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function changeCenterPassword(centerId, currentPassword, newPassword) {
  const supabase = getSupabaseServerClient();
  const { data: center, error: fetchError } = await supabase
    .from("centers")
    .select("password_hash")
    .eq("id", centerId)
    .single();
  if (fetchError || !center) return { ok: false, error: "Center not found." };

  const matches = await bcrypt.compare(currentPassword, center.password_hash);
  if (!matches) return { ok: false, error: "Current password is incorrect." };
  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: "New password must be at least 4 characters." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase
    .from("centers")
    .update({ password_hash: passwordHash })
    .eq("id", centerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
