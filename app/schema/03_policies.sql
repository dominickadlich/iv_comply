-- ===========================================
--              Organizations
-- ===========================================

-- Users can view their own organization
create policy "View own org" 
on organizations
for select
using(
    id = get_my_org_id()
);

-- ===========================================
--                  Profiles
-- ===========================================

-- Users can view colleagues in same org
create policy "View colleagues in the same org"
on profiles
for select
using(
    organization_id = get_my_org_id()
);


-- Users can update their own profile (but not role or org_id)
create policy "Update own profile"
on profiles
for update
using (
    id = auth.uid()
)
with check (
    id = auth.uid()
    and organization_id = (
        select organization_id from profiles where id = auth.uid()
    )
    and role = (
        select role from profiles where id = auth.uid()
    )
);


-- Auto-insert via trigger
create policy "Auto-insert profile on signup"
on profiles
for insert
with check (true);


-- ===========================================
--              Compliance Types
-- ===========================================

-- Everyone in org can view requirements
create policy "View org requirements"
on compliance_types
for select
using (
    organization_id = get_my_org_id()
);


-- Only managers can create/update/delete requirements
create policy "Managers manage requirements"
on compliance_types
for all 
using (
    organization_id = get_my_org_id()
    and exists (
        select 1 from profiles
        where id = auth.uid() 
    )
)
with check (
organization_id = get_my_org_id()
    and exists (
        select 1 from profiles
        where id = auth.uid()
        and role in ('manager', 'admin')
    )
);



-- ===========================================
--             Compliance Records 
-- ===========================================

-- Everyone in org can view compliance records
create policy "View org records"
on compliance_records
for select
using (
    organization_id = get_my_org_id()
);


-- Users can insert their own records
create policy "Insert own records"
on compliance_records
for insert 
with check (
    organization_id = get_my_org_id()
    and user_id = auth.uid() 
);


-- Users can update their own records
create policy "Update own records"
on compliance_records
for update
using (
    organization_id = get_my_org_id()
    and user_id = auth.uid()
)
with check (
    organization_id = get_my_org_id()
    and user_id = auth.uid()
);


-- ===========================================
--            Notifications Log
-- ===========================================

-- User can view notifications sent to them
create policy "View own notifications"
on notifications_log
for select
using (
    organization_id = get_my_org_id()
    and user_id = auth.uid()
);


-- System/service can insert notifications (Edge functions and service_role)
create policy "System can insert notifications"
on notifications_log
for insert
with check (true);