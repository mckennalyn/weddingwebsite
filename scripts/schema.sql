create extension if not exists pgcrypto;

create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'attending', 'declined')),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guests_name_idx on guests (lower(first_name), lower(last_name));

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
