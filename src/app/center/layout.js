import RequireRole from "@/components/auth/RequireRole";

export default function CenterLayout({ children }) {
  return <RequireRole role="center">{children}</RequireRole>;
}
