-- ===========================================
    -- Auto-create Profile on User Signup
-- ===========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin 
    insert into public.profiles (id, first_name, last_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'first_name', ''), 
        coalesce(new.raw_user_meta_data->>'last_name', '')
    );
    return new;
end;
$$ language plpgsql security definer;



-- ===========================================
             -- Attach Trigger
-- ===========================================
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();



-- ===========================================
           -- Security Definer
-- ===========================================
create or replace function public.get_my_org_id()
returns uuid as $$
    -- Query the profiles table to find the organization_id for the current user
    select organization_id
    from profiles
    where id = auth.uid() -- auth.uid() is Supabase's built-in function for the User ID
$$ language sql security definer;



-- ===========================================
            -- Calculate Due Date
-- ===========================================
create or replace function public.calculate_due_date()
returns trigger as $$
declare
    days_interval int;
begin
    -- Find the frequenct from the compliance_types table
    select frequency_days into days_interval
    from compliance_types
    where id = new.compliance_type_id;

    -- Calculate the date
    new.next_due_date := new.date_completed + days_interval;

    return new;
end;
$$ language plpgsql;


-- ===========================================
            -- Due Date Trigger
-- ===========================================
create trigger set_next_due_date
    before insert on compliance_records
    for each row execute procedure public.calculate_due_date();