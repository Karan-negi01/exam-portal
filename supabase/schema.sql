-- CertifyHub schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)
-- against a fresh project.

create extension if not exists "pgcrypto";

-- ---------- Centers ----------
create table if not exists centers (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  owner_name text not null,
  email text not null unique,
  password_hash text not null,
  phone text not null,
  location text not null,
  course_types text[] not null default '{}',
  pan_card_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'suspended', 'rejected')),
  seats int not null default 0,
  price_per_seat int not null default 200,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revenue_collected int not null default 0,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ---------- Students ----------
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers(id) on delete cascade,
  student_code text not null,
  name text not null,
  phone text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists students_center_id_idx on students(center_id);

-- ---------- Question papers (authored by the platform admin) ----------
create table if not exists question_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  duration_minutes int not null,
  passing_marks int not null,
  questions_per_exam int not null,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references question_papers(id) on delete cascade,
  text text not null,
  options text[] not null,
  correct_index int not null
);
create index if not exists questions_paper_id_idx on questions(paper_id);

-- ---------- Exams (a center scheduling a paper for its students) ----------
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references centers(id) on delete cascade,
  question_paper_id uuid references question_papers(id) on delete set null,
  title text not null,
  subject text not null,
  date date not null,
  duration_minutes int not null,
  passing_marks int not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);
create index if not exists exams_center_id_idx on exams(center_id);

-- Full content snapshot drawn at schedule time from the paper's question bank --
-- this never changes even if the source paper is edited afterwards.
-- question_id points back at the original question purely so analytics can
-- correlate "this question" across every exam it was ever drawn into.
create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  question_id uuid,
  order_index int not null,
  text text not null,
  options text[] not null,
  correct_index int not null
);
create index if not exists exam_questions_exam_id_idx on exam_questions(exam_id);
create index if not exists exam_questions_question_id_idx on exam_questions(question_id);

create table if not exists exam_assigned_students (
  exam_id uuid not null references exams(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  primary key (exam_id, student_id)
);

create table if not exists exam_retakes_granted (
  exam_id uuid not null references exams(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  primary key (exam_id, student_id)
);

-- ---------- Attempts ----------
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  center_id uuid not null references centers(id) on delete cascade,
  answers int[] not null,
  time_taken_seconds int not null,
  focus_violations int not null default 0,
  score int not null,
  total_marks int not null,
  passed boolean not null,
  submitted_at timestamptz not null default now()
);
create index if not exists attempts_exam_id_idx on attempts(exam_id);
create index if not exists attempts_student_id_idx on attempts(student_id);

-- ---------- Row Level Security ----------
-- Every table is locked down with RLS enabled and no policies. All real access
-- goes through Next.js Server Actions using the service-role key, which
-- bypasses RLS by design -- this is defense-in-depth in case the anon/public
-- key is ever used directly from the browser by mistake.
alter table centers enable row level security;
alter table students enable row level security;
alter table question_papers enable row level security;
alter table questions enable row level security;
alter table exams enable row level security;
alter table exam_questions enable row level security;
alter table exam_assigned_students enable row level security;
alter table exam_retakes_granted enable row level security;
alter table attempts enable row level security;
