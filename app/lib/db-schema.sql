-- Organization Table 
create table organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Future SaaS
    status text default 'active' check (status in ('active', 'inactive', 'trial'))
);
-- Always enable RLS immediately
alter table organizations enable row level security;


-- Profile Table
create table profiles (
    id uuid references auth.users on delete cascade primary key,

    -- User Details
    first_name text,
    last_name text,
    phone text,
    email text,

    -- The 'Golden Key' for Multi-tenancy
    organization_id uuid references organizations(id) on delete restrict,

    -- Role within organization
    role text not null default 'technician'
        check (role in ('admin', 'pharmacist', 'technician', 'manager'))

    -- Metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;





-- TODO: Update the rest of the tables below -- 

















-- Profile View for Same Org
create policy "Users can view colleagues in the same org"
on profiles
for select
using(
    organization_id = get_my_org_id()
)


-- Compliance Types Table
CREATE TABLE compliance_types (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id),

    -- The test details
    name text not null,
    description text,
    frequency_days integer not null,
    required_role text, -- 'Pharmacist', 'Technician', 'Any'

    -- Metadata
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()),

    -- Future: link to templates
    -- template_id UUID REFERENCES compliance_type_templates(id,

    unique(organization_id, name), -- Prevent duplicate test names per org
);
alter table compliance_types enable row level security


-- Compliance Records
create table compliance_records (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id),

    -- Record details
    user_id uuid not null references profiles(id) on delete restrict,
    compliance_type_id uuid not null references compliance_types(id) on delete restrict,
    date_completed timestamp,
    next_due_date timestamp,
    evidence_url text,
    notes text,
    
    -- metadata
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()),

    unique(organization_id, name), -- Prevent duplicate test names per org
)
alter table compliance_records enable row level security


-- Notifications Log
create table notifications_log(
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id) on delete restrict,,
    compliance_record_id uuid not null references compliance_records on delete restrict,,

    -- Notification details
    user_id uuid references profiles(id) on delete restrict,,
    notification_type text check (notification_type in ('due_soon', 'overdue', 'completed')),
    sent_at timestamp with time zone,

    -- metadata
    created_at timestamp with time zone default timezone('utc'::text, now()),
)
alter table notifications_log enable row level security