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
import { resetPasswordAction } from "@/app/actions/auth"
import Link from "next/link"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Sending...' : 'Send Reset Link'}
        </Button>
    )
}

export default function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)
        const result = await resetPasswordAction(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(result.message || 'Check your email for a password reset link')
        }
    }
  
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
                Enter your email below and we'll send you a link to reset your password
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
                {error && (
                    <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400">
                        {success}
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
                <SubmitButton />
                <div className="text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Back to login
                    </Link>
                </div>
            </div>
            </form>
        </CardContent>
    </Card>
  )
}
