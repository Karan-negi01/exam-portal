"use client";

import { forwardRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "./CertificateTemplate.module.css";

const CertificateTemplate = forwardRef(function CertificateTemplate(
  { studentName, examTitle, subject, centerName, dateStr, certId },
  ref
) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!certId || typeof window === "undefined") return;
    const verifyUrl = `${window.location.origin}/verify/${certId}`;
    QRCode.toDataURL(verifyUrl, { margin: 1, width: 160 })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [certId]);

  return (
    <div ref={ref} className={styles.certificate}>
      <div className={styles.border}>
        <span className={styles.cornerTL} />
        <span className={styles.cornerTR} />
        <span className={styles.cornerBL} />
        <span className={styles.cornerBR} />

        <div className={styles.brand}>
          <span className={styles.brandMark}>🎓</span>
          CertifyHub
        </div>
        <div className={styles.kicker}>Certificate of Completion</div>
        <h1 className={styles.heading}>{examTitle}</h1>

        <div className={styles.presentedTo}>This certificate is proudly presented to</div>
        <div className={styles.studentName}>{studentName}</div>

        <p className={styles.body}>
          for successfully completing the examination in{" "}
          <span className={styles.examTitle}>{subject}</span>, conducted by{" "}
          <span className={styles.examTitle}>{centerName}</span>, and issued on the CertifyHub
          platform on {dateStr}.
        </p>

        <div className={styles.scoreRow}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreValue}>PASS</div>
            <div className={styles.scoreLabel}>Result</div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.sign}>
            <div className={styles.signLine}>{centerName}</div>
            <div>Authorized Signatory</div>
          </div>
          <div className={styles.seal}>🏅</div>
          <div className={styles.sign}>
            <div className={styles.signLine}>CertifyHub</div>
            <div>Platform</div>
          </div>
        </div>

        <div className={styles.certId}>Certificate ID: {certId}</div>

        <div className={styles.verifyBlock}>
          {qrDataUrl && <img src={qrDataUrl} alt="Scan to verify" className={styles.qr} />}
          <div className={styles.verifyText}>
            <div className={styles.verifyLabel}>Scan to verify</div>
            <div className={styles.verifyCertId}>{certId}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;
