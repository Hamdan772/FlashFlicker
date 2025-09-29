import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Award,
  BookOpenCheck,
  type LucideIcon,
  Bell,
  BrainCircuit,
} from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const baseNavLinks: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/coach',
    label: 'AI Coach',
    icon: BrainCircuit,
  },
  {
    href: '/dashboard/reminders',
    label: 'Reminders',
    icon: Bell,
  },
  {
    href: '/dashboard/quizzes',
    label: 'Quiz Generator',
    icon: BookOpenCheck,
  },
  {
    href: '/dashboard/flashcards',
    label: 'Flashcards',
    icon: ClipboardCheck,
  },
  {
    href: '/dashboard/notes',
    label: 'Notes',
    icon: FileText,
  },
  {
    href: '/dashboard/rewards',
    label: 'Rewards',
    icon: Award,
  },
];

export function getNavLinks(isOwner: boolean): NavLink[] {
  if (isOwner) {
    // This could be a separate file if it grows
    const ownerLinks: NavLink[] = [
      ...baseNavLinks,
      // The "Download Code" feature has been removed.
    ];
    return ownerLinks;
  }
  return baseNavLinks;
}
