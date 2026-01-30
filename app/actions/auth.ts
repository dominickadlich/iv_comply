'use server'

import { createClient } from "../lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
    // Extract form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
        return { error: 'Email and password required'}
    }

    // Create Supabase client (server-side)
    const supabase = await createClient()

    // Attempt sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        return { error: error.message }
    }

    // Success! Redirect to dashboard
    redirect('/dashboard')
}


export async function signupAction(formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!firstName || !lastName || !email || !password) {
        return { error: 'All fields are required'}
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters'}
    }

    const supabase = await createClient()


    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: 'Failed to create user' }
    }


    // Step 2: Create profile
    const TEMP_ORG_ID = '49a836d9-0047-4eb5-a622-555fc457fb5a'

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: authData.user.id,
            org_id: TEMP_ORG_ID,
            email: email,
            first_name: firstName,
            lastName: lastName,
            role: 'pharmacist'
        })

    if (profileError) {
        console.error('Profile creation error:', profileError)
        return { error: 'Account created but setup failed. Please contact support.'}
    }


    // Note: By default Supabase sends a confirmation email
    // Disable for development in Supabase settings
    return {
        success: true,
        message: 'Account created successfully! You can now log in.'
    }
} 


export async function resetPasswordAction(formData: FormData) {
    // Extract form data
    const email = formData.get('email') as string

    // Validate inputs
    if (!email ) {
        return { error: 'Email required'}
    }

    // Create Supabase client (server-side)
    const supabase = await createClient()

    // Attempt sign-in
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`
    })

    if (error) {
        return { error: error.message }
    }
    return {
        success: true,
        message: 'Please check your email for a password reset link'
    }
}


export async function updatePasswordAction(formData: FormData) {
    // Exctract form data
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate inputs
    if (!password || !confirmPassword) {
        return { error: 'Both password fields are required' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const supabase = await createClient()

    // Update the users password
    const { data, error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { 
        success: true,
        message: 'Password updated successfully! Redirecting to login...' 
    }
}