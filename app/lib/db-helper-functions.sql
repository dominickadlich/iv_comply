-- Trigger Profile Creation in upon Auth User Creation
-- 1. Create the function that runs on signup
create function public.handle_new_user()
returns trigger as $$
begin 
    insert into public.profiles (id, first_name, last_name)
    values (
        new.id,
        new.raw_user_meta_data->>'first_name', 
        new.raw_user_meta_data->>'last_name'
    );
    return new;
end;
$$ language plpgsql security definer;

-- 2. 'Attach' the function to the auth.users table
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


-- Security Definer
create or replace function public.get_my_org(id)
returns uuid as $$
    -- Query the profiles table to find the organization_id for the current user
    select organization_id
    from profiles
    where id = auth.uid() -- auth.uid() is Supabase's built-in function for the User ID
$$ language sql security definer