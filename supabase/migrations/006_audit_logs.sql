-- Migration 006: Role Activity Audit Logs Table
-- Append-only audit logging system for administrative actions.

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references public.admin_profiles(id) on delete set null,
    actor_role text,
    action text not null,
    entity_type text not null,
    entity_id text,
    status text not null default 'success' check (status in ('success', 'failure')),
    metadata jsonb not null default '{}'::jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz not null default now()
);

-- Indexes for performance filtering
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_entity_type on public.audit_logs(entity_type);
create index if not exists idx_audit_logs_status on public.audit_logs(status);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- SELECT policy: Active Owner and Admin only
create policy "Active owner and admin can view audit logs"
    on public.audit_logs
    for select
    using (
        exists (
            select 1 from public.admin_profiles ap
            where ap.id = auth.uid()
              and ap.status = 'active'
              and ap.role in ('owner', 'admin')
        )
    );

-- INSERT policy: Active Owner, Admin, and Editor can record audit logs
create policy "Active owner, admin, and editor can insert audit logs"
    on public.audit_logs
    for insert
    with check (
        exists (
            select 1 from public.admin_profiles ap
            where ap.id = auth.uid()
              and ap.status = 'active'
              and ap.role in ('owner', 'admin', 'editor')
        )
    );

-- NO UPDATE POLICY (Append-only)
-- NO DELETE POLICY (Append-only)
