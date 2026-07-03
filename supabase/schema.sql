create extension if not exists pgcrypto;

create table if not exists survey_sessions (
  id text primary key,
  name text not null,
  admin_email text,
  created_at timestamptz not null default now(),
  stopped_at timestamptz,
  votes jsonb not null default '{
    "tico": 0,
    "bobbi": 0,
    "mugsy": 0,
    "axel": 0,
    "cherrylu": 0,
    "nova": 0,
    "marsha": 0,
    "pip": 0
  }'::jsonb
);

create index if not exists survey_sessions_created_at_idx
  on survey_sessions (created_at desc);

create table if not exists survey_responses (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references survey_sessions(id) on delete cascade,
  primary_id text not null,
  secondary_id text,
  role text,
  scores jsonb,
  answers jsonb,
  created_at timestamptz not null default now()
);

alter table survey_responses
  add column if not exists secondary_id text,
  add column if not exists role text,
  add column if not exists scores jsonb,
  add column if not exists answers jsonb;

create index if not exists survey_responses_session_id_idx
  on survey_responses (session_id);

create or replace function record_survey_vote(
  p_session_id text,
  p_primary_id text,
  p_secondary_id text default null,
  p_role text default null,
  p_scores jsonb default null,
  p_answers jsonb default null
)
returns survey_sessions
language plpgsql
as $$
declare
  updated_session survey_sessions;
begin
  if p_primary_id not in ('tico', 'bobbi', 'mugsy', 'axel', 'cherrylu', 'nova', 'marsha', 'pip') then
    raise exception 'Unknown character id';
  end if;

  update survey_sessions
  set votes = jsonb_set(
    votes,
    array[p_primary_id],
    to_jsonb(coalesce((votes ->> p_primary_id)::integer, 0) + 1),
    true
  )
  where id = p_session_id
    and stopped_at is null
  returning * into updated_session;

  if updated_session.id is null then
    raise exception 'Session not found or stopped';
  end if;

  insert into survey_responses (session_id, primary_id, secondary_id, role, scores, answers)
  values (p_session_id, p_primary_id, p_secondary_id, p_role, p_scores, p_answers);

  return updated_session;
end;
$$;

insert into survey_sessions (id, name, admin_email)
values ('main', 'Main session', 'admin@yourwaylearning.com')
on conflict (id) do nothing;
