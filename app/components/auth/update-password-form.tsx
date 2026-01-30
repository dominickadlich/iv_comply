'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
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
import { updatePasswordAction } from "@/app/actions/auth"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Updating...' : 'Update Password'}
        </Button>
    )
}

export default function UpdatePasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)
        const result = await updatePasswordAction(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(result.message || 'Password Updated!')
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
    }
  
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Update password</CardTitle>
            <CardDescription>
                Enter your new password below
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
                <Label htmlFor="password">New Password</Label>
                <Input 
                    id="password"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    required 
                />
                <CardDescription>At least 6 characters</CardDescription>
                </div>
                <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                    id="confirmPassword"
                    type="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    required 
                />
                </div>
                <SubmitButton />
            </div>
            </form>
        </CardContent>
    </Card>
  )
}
