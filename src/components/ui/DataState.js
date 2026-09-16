import Card from "./Card";

export default function DataState({ loading, error }) {
  return (
    <Card>
      <div
        style={{
          padding: "24px 0",
          textAlign: "center",
          color: error ? "var(--color-danger)" : "var(--color-ink-soft)",
          fontSize: "0.92rem",
        }}
      >
        {error || "Loading…"}
      </div>
    </Card>
  );
}
