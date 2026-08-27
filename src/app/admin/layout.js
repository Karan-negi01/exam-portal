import RequireRole from "@/components/auth/RequireRole";

export default function AdminLayout({ children }) {
  return <RequireRole role="admin">{children}</RequireRole>;
}
