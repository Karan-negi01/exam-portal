import LegalPage from "@/components/site/LegalPage";

export const metadata = {
  title: "Privacy Policy — Skorex",
  description: "How Skorex collects, uses and protects information from training centers and students.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 19, 2026"
      intro={
        <>
          <p>
            Skorex (&ldquo;Skorex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            operates the platform available at skorex.in (the &ldquo;Platform&rdquo;), which
            allows training centers to enroll students, conduct online MCQ exams, and issue
            certificates. This Privacy Policy explains what information we collect, how we use
            it, and the choices you have.
          </p>
          <p>
            By using the Platform, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </>
      }
    >
      <section>
        <h2>1. Information We Collect</h2>

        <h3>1.1 From Training Centers</h3>
        <ul>
          <li>Center name, business/owner name, and contact details (email, phone)</li>
          <li>PAN card details, submitted for verification during the application process</li>
          <li>Location and course/subject types offered</li>
          <li>Payment and billing details related to Seat Pack purchases</li>
        </ul>

        <h3>1.2 From Students</h3>
        <ul>
          <li>Full name</li>
          <li>Phone number (used to generate login credentials)</li>
          <li>Exam attempt data: responses, scores, pass/fail status, and timestamps</li>
          <li>Certificate details generated on passing an exam</li>
        </ul>

        <h3>1.3 Automatically Collected Information</h3>
        <ul>
          <li>Log data such as IP address, browser type, device information, and pages visited</li>
          <li>Cookies and similar tracking technologies used to keep you logged in and improve the Platform</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information collected to:</p>
        <ul>
          <li>Verify and onboard training centers</li>
          <li>Create and manage student login accounts</li>
          <li>Administer, time, and auto-grade exams</li>
          <li>Generate and issue certificates</li>
          <li>Process Seat Pack payments and maintain billing records</li>
          <li>Communicate with centers and students about their accounts, exams, or support requests</li>
          <li>Improve, secure, and maintain the Platform</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
      </section>

      <section>
        <h2>3. Sharing of Information</h2>
        <p>We do not sell your personal information. We may share information:</p>
        <ul>
          <li>With the training center a student is enrolled under, for the purpose of managing that student&apos;s exams and certificates</li>
          <li>With payment processors (such as Razorpay) solely to process Seat Pack payments</li>
          <li>With SMS/communication service providers to deliver login credentials and notifications</li>
          <li>With law enforcement or regulatory authorities, where required by law</li>
          <li>With service providers who help us operate the Platform (e.g., hosting), under confidentiality obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Retention</h2>
        <p>
          We retain center and student data for as long as the account remains active and for a
          reasonable period afterward, to comply with legal, accounting, and record-keeping
          obligations, or to resolve disputes. Exam records and certificates may be retained
          longer to preserve the integrity of issued certificates.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We use reasonable technical and organizational measures (such as access controls and
          encrypted transmission) to protect your information. However, no method of transmission
          or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>Depending on applicable law, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information, subject to our legal retention requirements</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:hello@skorex.in">hello@skorex.in</a>.
        </p>
      </section>

      <section>
        <h2>7. Children&apos;s Information</h2>
        <p>
          The Platform is used by students who may be minors, accessed and managed through their
          training center. Training centers are responsible for obtaining any necessary parental
          or guardian consent before enrolling a minor student.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          We use cookies to keep users logged in and to understand how the Platform is used. You
          can control cookies through your browser settings, though disabling them may affect
          Platform functionality.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be notified
          via the Platform or by email. Continued use of the Platform after changes take effect
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>For any questions about this Privacy Policy, contact us at:</p>
        <p>
          Email: <a href="mailto:hello@skorex.in">hello@skorex.in</a>
          <br />
          Hours: Mon–Sat, 10am–7pm IST
        </p>
      </section>
    </LegalPage>
  );
}
