'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
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
import { signupAction } from "@/app/actions/auth"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing Up...' : 'Sign Up'}
        </Button>
    )
}

export default function SignUpForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)
        const result = await signupAction(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(result.message || 'Account created successfully!')
        }
    }
  
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
                Enter your email below to create an account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}
                <div className="grid gap-2">
                <Label>First Name</Label>
                <Input 
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                />
                <Label>Last Name</Label>
                <Input 
                    id="lasttName"
                    name="lasstName"
                    placeholder="Doe"
                    required
                />
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
        <CardFooter className="flex flex-col gap-2">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
