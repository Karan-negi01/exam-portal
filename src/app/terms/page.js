import LegalPage, { Placeholder } from "@/components/site/LegalPage";

export const metadata = {
  title: "Terms & Conditions — Skorex",
  description: "The terms that govern use of the Skorex platform by training centers and students.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="September 19, 2026"
      intro={
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern access to and use of the
          Skorex platform, operated by <Placeholder>[Insert Legal Entity Name]</Placeholder>{" "}
          (&ldquo;Skorex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By
          registering a training center, enrolling as a student, or otherwise using the platform
          available at skorex.in (the &ldquo;Platform&rdquo;), you agree to be bound by these
          Terms. If you do not agree, do not use the Platform.
        </p>
      }
    >
      <section>
        <h2>1. Eligibility and Accounts</h2>
        <p>
          Training centers must provide accurate business and contact information when applying
          to join the Platform. Student accounts are created and managed by the training center
          they are enrolled with; the center is responsible for ensuring appropriate consent has
          been obtained for each student it enrolls. Account holders are responsible for
          maintaining the confidentiality of their login credentials and for all activity that
          occurs under their account.
        </p>
      </section>

      <section>
        <h2>2. Center Approval and Suspension</h2>
        <p>
          Training center applications are reviewed and approved at Skorex&apos;s discretion.
          We may suspend or reject a center&apos;s account at any time if we reasonably believe it
          has violated these Terms, engaged in fraudulent activity, or misused the Platform,
          including but not limited to exam malpractice, misrepresentation of credentials, or
          non-payment for Seat Packs.
        </p>
      </section>

      <section>
        <h2>3. Seat Packs and Payment</h2>
        <p>
          Centers purchase &ldquo;Seat Packs&rdquo; to enroll students on the Platform. Prices,
          seat quotas, and validity periods are as displayed at the time of purchase. All fees are
          exclusive of applicable taxes unless stated otherwise. Payments are processed through
          third-party payment gateways; Skorex does not store full payment card details.
        </p>
      </section>

      <section>
        <h2>4. Exams and Certification</h2>
        <p>
          Exams are administered online and are timed, auto-graded, and subject to anti-cheat
          monitoring (such as detecting when a student exits full-screen mode or switches away
          from the exam window). Skorex reserves the right to invalidate an exam attempt or
          revoke a certificate where there is reasonable evidence of malpractice, impersonation,
          or technical manipulation of the exam session.
        </p>
      </section>

      <section>
        <h2>5. Certificates</h2>
        <p>
          Certificates issued through the Platform are digitally verifiable via a unique
          certificate ID and QR code. A certificate reflects that a student passed a specific exam
          administered through the Platform; it does not constitute a government-recognized
          degree or diploma unless separately stated by the issuing training center.
        </p>
      </section>

      <section>
        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Share login credentials or allow another person to take an exam on your behalf</li>
          <li>Attempt to access, copy, or distribute exam content without authorization</li>
          <li>Interfere with or disrupt the Platform&apos;s operation, including attempts to bypass anti-cheat measures</li>
          <li>Use the Platform for any unlawful purpose or in violation of these Terms</li>
        </ul>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          All question papers, branding, software, and content made available through the
          Platform are owned by Skorex or its licensors and are protected by applicable
          intellectual property laws. No license is granted to reproduce, distribute, or create
          derivative works from Platform content except as necessary to use the Platform as
          intended.
        </p>
      </section>

      <section>
        <h2>8. Fees and Refunds</h2>
        <p>
          Seat Pack purchases are subject to the separate{" "}
          <a href="/refund-policy">Refund &amp; Cancellation Policy</a>, which forms part of these
          Terms.
        </p>
      </section>

      <section>
        <h2>9. Disclaimers</h2>
        <p>
          The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
          We do not guarantee that the Platform will be uninterrupted, error-free, or completely
          secure. Skorex is not responsible for the accuracy of information provided by
          training centers about their own courses or programs.
        </p>
      </section>

      <section>
        <h2>10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Skorex shall not be liable for any indirect,
          incidental, or consequential damages arising from use of the Platform, including loss of
          data, loss of business, or loss of certification value. Our total liability for any
          claim arising from these Terms shall not exceed the fees paid by the relevant center in
          the preceding twelve months.
        </p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India. Any
          disputes arising under these Terms shall be subject to the exclusive jurisdiction of the
          courts of <Placeholder>[Insert City]</Placeholder>, India.
        </p>
      </section>

      <section>
        <h2>12. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will be notified via the
          Platform or by email. Continued use of the Platform after changes take effect
          constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>For any questions about these Terms, contact us at:</p>
        <p>
          Email: <a href="mailto:hello@skorex.in">hello@skorex.in</a>
          <br />
          Hours: Mon–Sat, 10am–7pm IST
        </p>
      </section>
    </LegalPage>
  );
}
