-- ===========================================
           -- Organization 
-- ===========================================
create table organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Future SaaS
    status text default 'active' check (status in ('active', 'inactive', 'trial'))
);
-- Always enable RLS immediately
alter table organizations enable row level security;



-- ===========================================
             -- Profile 
-- ===========================================
create table profiles (
    id uuid references auth.users on delete cascade primary key,

    -- User Details
    first_name text,
    last_name text,
    phone text,

    -- The 'Golden Key' for Multi-tenancy
    organization_id uuid references organizations(id) on delete set null,

    -- Role within organization
    role text not null default 'technician'
        check (role in ('admin', 'pharmacist', 'technician', 'manager')),

    -- Metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;


-- ===========================================
         -- Compliance Types 
-- ===========================================
create table compliance_types (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id) on delete restrict,

    -- The test details
    name text not null,
    description text,
    frequency_days integer not null check (frequency_days > 0),
    required_role text check (required_role in ('pharmacist', 'technician', 'manager', 'any')),

    -- Metadata
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    -- Future: link to templates
    -- template_id UUID REFERENCES compliance_type_templates(id,

    unique(organization_id, name) -- Prevent duplicate test names per org
);
alter table compliance_types enable row level security;



-- ============================================
--        Compliance Records
-- ============================================
create table compliance_records (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id) on delete restrict,


    -- Who Completed
    user_id uuid not null references profiles(id) on delete restrict,

    -- What Test
    compliance_type_id uuid not null references compliance_types(id) on delete restrict,

    -- When
    date_completed date not null,
    next_due_date date not null,

    -- Evidence (link to Supabase storage)
    evidence_url text,

    -- Optional notes
    notes text,
    
    -- metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table compliance_records enable row level security;


-- ===========================================
           -- Notifications Log
-- ===========================================
create table notifications_log(
    id uuid default gen_random_uuid() primary key,
    organization_id uuid not null references organizations(id) on delete restrict,

    -- What Record
    compliance_record_id uuid not null references compliance_records(id) on delete cascade,

    -- Who Notified
    user_id uuid references profiles(id) on delete restrict,

    -- Notification Details
    notification_type text check (notification_type in ('due_soon', 'overdue', 'completed')),
    message text not null,
    sent_at timestamp with time zone default timezone('utc'::text, now()),

    -- metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table notifications_log enable row level security;