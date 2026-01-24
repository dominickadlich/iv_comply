-- ============================================
--     NUCLEAR OPTION: Reset Everything
-- ============================================
-- WARNING: This deletes ALL data!
-- Only use during development, NEVER in production

-- Drop policies first (they depend on tables)
drop policy if exists "View own org" on organizations;
drop policy if exists "View colleagues in same org" on profiles;
drop policy if exists "Update own profile" on profiles;
drop policy if exists "Auto-insert profile on signup" on profiles;
drop policy if exists "View org requirements" on compliance_types;
drop policy if exists "Managers manage requirements" on compliance_types;
drop policy if exists "View org records" on compliance_records;
drop policy if exists "Insert own records" on compliance_records;
drop policy if exists "Update own records" on compliance_records;
drop policy if exists "View own notifications" on notifications_log;
drop policy if exists "System can insert notifications" on notifications_log;

-- Drop triggers
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_new_user();
drop function if exists public.get_my_org_id();

-- Drop tables (in reverse dependency order)
drop table if exists notifications_log;
drop table if exists compliance_records;
drop table if exists compliance_types;
drop table if exists profiles;
drop table if exists organizations;