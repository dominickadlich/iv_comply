import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export { cn } from '@/lib/utils'

export function calculateDueDate(completedDate: Date, frequencyDays: number): Date {
    const due = new Date(completedDate)
    due.setDate(due.getDate() + frequencyDays)
    return due
}

export function isExpiringSoon(dueDate: Date, daysThreshold: number = 30): boolean {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= daysThreshold && diffDays > 0
}