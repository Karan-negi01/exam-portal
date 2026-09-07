"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import QuestionPaperForm from "@/components/admin/QuestionPaperForm";
import { useDB } from "@/lib/useDB";
import { updateQuestionPaper } from "@/lib/store";

export default function EditQuestionPaperPage({ params }) {
  const { paperId } = use(params);
  const router = useRouter();
  const db = useDB();

  const paper = db.questionPapers.find((p) => p.id === paperId);

  if (!paper) {
    return (
      <DashboardShell navItems={ADMIN_NAV} roleTag="Platform admin" userMeta="Full platform access" title="Paper not found">
        <Card>
          <EmptyState
            icon="🔍"
            title="This question paper doesn't exist"
            description="It may have been deleted."
            action={<Button href="/admin/question-papers" size="sm">Back to question papers</Button>}
          />
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title={`Edit ${paper.title}`}
      subtitle="Changes only apply to future scheduling — exams already scheduled from this paper keep their original questions."
    >
      <QuestionPaperForm
        initialData={paper}
        submitLabel="Save changes"
        onCancel={() => router.push("/admin/question-papers")}
        onSubmit={(data) => {
          updateQuestionPaper(paper.id, data);
          router.push("/admin/question-papers");
        }}
      />
    </DashboardShell>
  );
}
