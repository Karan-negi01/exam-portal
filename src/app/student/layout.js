import RequireRole from "@/components/auth/RequireRole";

export default function StudentLayout({ children }) {
  return <RequireRole role="student">{children}</RequireRole>;
}
