"use client";

import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import QuestionPaperForm from "@/components/admin/QuestionPaperForm";
import { createQuestionPaper } from "@/lib/store";

export default function NewQuestionPaperPage() {
  const router = useRouter();

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Create a question paper"
      subtitle="This becomes available for every center to schedule for their students."
    >
      <QuestionPaperForm
        submitLabel="Save question paper"
        onCancel={() => router.push("/admin/question-papers")}
        onSubmit={(data) => {
          createQuestionPaper(data);
          router.push("/admin/question-papers");
        }}
      />
    </DashboardShell>
  );
}
