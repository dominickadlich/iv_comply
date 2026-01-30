'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/app/actions/auth"
import Link from "next/link"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    )
}

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await loginAction(formData)

        if (result?.error) {
            setError(result.error)
        }
        // If no error, redirect() in the action handles navigation
    }
  
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
            Enter your email below to login to your account
            </CardDescription>
            <CardAction>
            <Link
                href="/signup"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
                Sign Up
            </Link>
            </CardAction>
        </CardHeader>
        <CardContent>
            <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="pharmacist@hospital.com"
                    required
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                    </a>
                </div>
                <Input 
                    id="password"
                    type="password"
                    name="password"
                    required 
                />
                </div>
                <SubmitButton />
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full">
            Login with Google
            </Button>
        </CardFooter>
    </Card>
  )
}
