"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormShell from "@/components/site/FormShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import styles from "./[certId]/page.module.css";

export default function VerifyLookupPage() {
  const router = useRouter();
  const [lookupValue, setLookupValue] = useState("");

  function handleLookup(e) {
    e.preventDefault();
    const trimmed = lookupValue.trim();
    if (trimmed) router.push(`/verify/${trimmed.toUpperCase()}`);
  }

  return (
    <FormShell
      title="Certificate verification"
      subtitle="Check whether a Skorex certificate is genuine."
      maxWidth="480px"
    >
      <Card>
        <form onSubmit={handleLookup} className={styles.lookupForm}>
          <Field label="Certificate ID">
            <Input
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              placeholder="e.g. 3F9C2A1B"
              autoFocus
            />
          </Field>
          <Button type="submit" block>
            Verify
          </Button>
        </form>
      </Card>
    </FormShell>
  );
}
