-- Core nodes table for folders and notes
create table nodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  parent_id uuid references nodes(id) on delete cascade,
  type text not null check (type in ('folder', 'note')),
  title text not null,
  content jsonb, -- only used when type = 'note'
  position integer not null default 0, -- ordering inside a folder
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_nodes_user on nodes(user_id);
create index idx_nodes_parent on nodes(parent_id);
create index idx_nodes_type on nodes(type);

-- Enable Row Level Security
alter table nodes enable row level security;

-- RLS Policies
create policy "read own nodes"
on nodes for select
using (auth.uid() = user_id);

create policy "insert own nodes"
on nodes for insert
with check (auth.uid() = user_id);

create policy "update own nodes"
on nodes for update
using (auth.uid() = user_id);

create policy "delete own nodes"
on nodes for delete
using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger update_nodes_updated_at
before update on nodes
for each row
execute function update_updated_at_column();
