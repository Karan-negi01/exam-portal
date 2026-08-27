"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import CertificateTemplate from "./CertificateTemplate";
import { downloadCertificatePdf } from "@/lib/certificate";

export default function CertificateDownloadButton({ data, size = "sm" }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const filename = `${data.studentName.replace(/\s+/g, "_")}_certificate.pdf`;
      await downloadCertificatePdf(ref.current, filename);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size={size} variant="accent" onClick={handleClick} disabled={loading}>
        {loading ? "Generating…" : "🏅 Certificate"}
      </Button>
      <div style={{ position: "fixed", top: 0, left: "-10000px", zIndex: -1 }} aria-hidden="true">
        <CertificateTemplate ref={ref} {...data} />
      </div>
    </>
  );
}
