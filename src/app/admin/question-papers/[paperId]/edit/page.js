"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import QuestionPaperForm from "@/components/admin/QuestionPaperForm";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { updateQuestionPaper } from "@/actions/questionPapers";

export default function EditQuestionPaperPage({ params }) {
  const { paperId } = use(params);
  const router = useRouter();
  const { data: db, loading, error } = useAsyncData(getFullDb);

  if (loading || error || !db) {
    return (
      <DashboardShell navItems={ADMIN_NAV} roleTag="Platform admin" userMeta="Full platform access" title="Edit question paper">
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

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
        onSubmit={async (data) => {
          await updateQuestionPaper(paper.id, data);
          router.push("/admin/question-papers");
        }}
      />
    </DashboardShell>
  );
}
