import LegalPage from "@/components/site/LegalPage";

export const metadata = {
  title: "Refund & Cancellation Policy — CertifyHub",
  description: "CertifyHub's policy on Seat Pack refunds and cancellations for training centers.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="September 19, 2026"
      intro={
        <p>
          This Refund &amp; Cancellation Policy explains how refunds and cancellations are
          handled for Seat Pack purchases made on the CertifyHub platform (the &ldquo;Platform&rdquo;).
          It forms part of our <a href="/terms">Terms &amp; Conditions</a>.
        </p>
      }
    >
      <section>
        <h2>1. Seat Pack Purchases</h2>
        <p>
          When a training center purchases a Seat Pack, seats are allocated to that center&apos;s
          account immediately and remain valid for one year from the date of purchase. Seat Packs
          are a digital service activated at the time of payment.
        </p>
      </section>

      <section>
        <h2>2. General Refund Policy</h2>
        <p>
          Because Seat Packs are activated immediately upon purchase and grant instant access to
          the Platform&apos;s features, payments are generally <strong>non-refundable</strong> once
          a Seat Pack has been purchased, except as described below.
        </p>
      </section>

      <section>
        <h2>3. Eligible Refund Cases</h2>
        <p>A refund may be considered in the following situations:</p>
        <ul>
          <li>A duplicate or accidental payment was made for the same Seat Pack purchase</li>
          <li>A technical error on CertifyHub&apos;s end resulted in a charge without the corresponding seats being credited to the center&apos;s account</li>
          <li>A center&apos;s application is rejected by CertifyHub&apos;s admin team after payment was already collected</li>
        </ul>
      </section>

      <section>
        <h2>4. Non-Refundable Situations</h2>
        <p>Refunds will not be issued in cases including:</p>
        <ul>
          <li>Seats that have already been used to enroll students or schedule exams</li>
          <li>Change of mind after a successful purchase</li>
          <li>A center being suspended for violating our Terms &amp; Conditions</li>
          <li>Seat Packs that have expired after their one-year validity period</li>
        </ul>
      </section>

      <section>
        <h2>5. How to Request a Refund</h2>
        <p>
          To request a refund, contact us at{" "}
          <a href="mailto:hello@certifyhub.app">hello@certifyhub.app</a> within 7 days of the
          payment, with your center name, registered email, and the payment reference. We will
          review the request and respond within 5 business days.
        </p>
      </section>

      <section>
        <h2>6. Refund Processing</h2>
        <p>
          Approved refunds are processed back to the original payment method within 7–10 business
          days, subject to processing times of the payment gateway and the issuing bank.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Refund &amp; Cancellation Policy from time to time. Material changes
          will be notified via the Platform or by email. Continued use of the Platform after
          changes take effect constitutes acceptance of the updated policy.
        </p>
      </section>
    </LegalPage>
  );
}
