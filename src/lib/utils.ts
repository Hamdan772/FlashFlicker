
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFeatureDescription(label: string): string {
    switch (label) {
        case 'AI Coach':
            return 'Chat with an AI tutor to get help with your study materials.';
        case 'Reminders':
            return 'Set custom reminders for deadlines and study sessions.';
        case 'Quiz Generator':
            return 'Create practice quizzes and exams to test your knowledge.';
        case 'Flashcards':
            return 'Create and study with interactive flashcards, generated manually or by AI.';
        case 'Notes':
            return 'Capture, edit, and summarize your thoughts with AI-powered notes.';
        case 'Rewards':
            return 'Earn XP, build streaks, and unlock badges to stay motivated.';
        default:
            return 'Enhance your learning experience.';
    }
}
