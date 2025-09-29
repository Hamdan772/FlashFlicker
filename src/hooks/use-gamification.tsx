
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useToast } from './use-toast';
import { useApiKey } from './use-api-key';

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  xpThreshold?: number;
  action?: keyof ProgressData['actions'];
  countThreshold?: number;
  secret?: boolean;
};

type ProgressData = {
  xp: number;
  streak: number;
  lastLogin: string;
  badges: Badge[];
  actions: {
    createNote: number;
    generateQuiz: number;
    createFlashcardDeck: number;
    takeExam: number;
  };
};

const GAMIFICATION_STORAGE_KEY = 'gamification_progress';

export const availableBadges: Badge[] = [
    // Existing Badges
    { id: 'first-note', name: 'Note Taker', emoji: '✍️', description: 'Create your first note', action: 'createNote', countThreshold: 1 },
    { id: 'five-notes', name: 'Scribe', emoji: '📜', description: 'Create 5 notes', action: 'createNote', countThreshold: 5 },
    { id: 'first-quiz', name: 'Quiz Whiz', emoji: '🧠', description: 'Generate your first quiz', action: 'generateQuiz', countThreshold: 1 },
    { id: 'five-quizzes', name: 'Mastermind', emoji: '🏆', description: 'Generate 5 quizzes', action: 'generateQuiz', countThreshold: 5 },
    { id: 'first-deck', name: 'Card Shark', emoji: '🃏', description: 'Create a flashcard deck', action: 'createFlashcardDeck', countThreshold: 1 },
    { id: 'level-2', name: 'Level 2 Learner', emoji: '🚀', description: 'Reach 100 XP', xpThreshold: 100 },
    { id: 'level-5', name: 'Power Learner', emoji: '⚡', description: 'Reach 500 XP', xpThreshold: 500 },
    { id: 'streak-3', name: 'On a Roll', emoji: '🔥', description: 'Maintain a 3-day streak' },

    // 50 New Public Badges
    // -- Note-taking Badges --
    { id: 'ten-notes', name: 'Archivist', emoji: '📚', description: 'Create 10 notes', action: 'createNote', countThreshold: 10 },
    { id: 'twenty-five-notes', name: 'Loremaster', emoji: '🧙', description: 'Create 25 notes', action: 'createNote', countThreshold: 25 },
    { id: 'fifty-notes', name: 'Grand Historian', emoji: '🏛️', description: 'Create 50 notes', action: 'createNote', countThreshold: 50 },
    { id: 'first-summary', name: 'Summarizer', emoji: '📝', description: 'Summarize a note for the first time', secret: true, action: 'createNote', countThreshold: 2 }, // Assuming summarization is part of note creation/editing
    
    // -- Quiz Badges --
    { id: 'ten-quizzes', name: 'Quiz Champion', emoji: '🏅', description: 'Generate 10 quizzes', action: 'generateQuiz', countThreshold: 10 },
    { id: 'twenty-five-quizzes', name: 'Quiz Legend', emoji: '👑', description: 'Generate 25 quizzes', action: 'generateQuiz', countThreshold: 25 },
    { id: 'hard-quiz', name: 'Challenge Seeker', emoji: '🧗', description: 'Generate a quiz on hard difficulty', secret: true }, // This would require tracking quiz difficulty
    
    // -- Flashcard Badges --
    { id: 'five-decks', name: 'Deck Builder', emoji: '🏗️', description: 'Create 5 flashcard decks', action: 'createFlashcardDeck', countThreshold: 5 },
    { id: 'ten-decks', name: 'Deck Master', emoji: '🧙‍♂️', description: 'Create 10 flashcard decks', action: 'createFlashcardDeck', countThreshold: 10 },
    
    // -- XP & Level Badges --
    { id: 'level-10', name: 'Scholar', emoji: '🧑‍🏫', description: 'Reach Level 10 (1000 XP)', xpThreshold: 1000 },
    { id: 'level-15', name: 'Prodigy', emoji: '🧑‍🔬', description: 'Reach Level 15 (1500 XP)', xpThreshold: 1500 },
    { id: 'level-20', name: 'Sage', emoji: '🧘', description: 'Reach Level 20 (2000 XP)', xpThreshold: 2000 },
    { id: 'level-25', name: 'Enlightened', emoji: '💡', description: 'Reach Level 25 (2500 XP)', xpThreshold: 2500 },
    { id: 'level-30', name: 'Ascended', emoji: '✨', description: 'Reach Level 30 (3000 XP)', xpThreshold: 3000 },
    { id: 'level-40', name: 'Genius', emoji: '🧠', description: 'Reach Level 40 (4000 XP)', xpThreshold: 4000 },
    { id: 'level-50', name: 'Brainiac', emoji: '🤖', description: 'Reach Level 50 (5000 XP)', xpThreshold: 5000 },

    // -- Streak Badges --
    { id: 'streak-7', name: 'Week-Long Warrior', emoji: '⚔️', description: 'Maintain a 7-day streak' },
    { id: 'streak-14', name: 'Fortnightly Fighter', emoji: '🛡️', description: 'Maintain a 14-day streak' },
    { id: 'streak-30', name: 'Month of Mastery', emoji: '🗓️', description: 'Maintain a 30-day streak' },
    { id: 'streak-60', name: 'Two-Month Titan', emoji: '💪', description: 'Maintain a 60-day streak' },
    { id: 'streak-90', name: 'Quarterly Quest', emoji: '🗺️', description: 'Maintain a 90-day streak' },
    
    // -- Exam Simulator Badges --
    { id: 'first-exam', name: 'Test Taker', emoji: '✍️', description: 'Try the Exam Simulator for the first time', action: 'takeExam', countThreshold: 1 },
    { id: 'five-exams', name: 'Examiner', emoji: '🧐', description: 'Complete 5 exams', action: 'takeExam', countThreshold: 5 },
    { id: 'ten-exams', name: 'Proctor', emoji: '👨‍🏫', description: 'Complete 10 exams', action: 'takeExam', countThreshold: 10 },

    // -- Miscellaneous & Fun Badges --
    { id: 'night-owl', name: 'Night Owl', emoji: '🦉', description: 'Study late at night (after 10 PM)', secret: true },
    { id: 'early-bird', name: 'Early Bird', emoji: '🐦', description: 'Study early in the morning (before 7 AM)', secret: true },
    { id: 'all-features', name: 'Explorer', emoji: '🧭', description: 'Use every main feature at least once' },
    { id: 'weekend-warrior', name: 'Weekend Warrior', emoji: '🏕️', description: 'Study on a Saturday or Sunday', secret: true },
    { id: 'perfect-score', name: 'Perfectionist', emoji: '💯', description: 'Get a 100% score on a quiz or exam', secret: true },
    { id: 'heavy-lifter', name: 'Heavy Lifter', emoji: '🏋️', description: 'Upload a large file (> 5MB)', secret: true },
    { id: 'speed-reader', name: 'Speed Reader', emoji: '⏩', description: 'Generate a summary for a long note', secret: true },
    { id: 'hat-trick', name: 'Hat Trick', emoji: '🎩', description: 'Use 3 different features in one day' },
    { id: 'curious-mind', name: 'Curious Mind', emoji: '🤔', description: 'Generate a quiz on a non-academic topic', secret: true },
    { id: 'librarian', name: 'Librarian', emoji: '🗂️', description: 'Create 3 flashcard decks in a single day' },
    { id: 'knowledge-builder', name: 'Knowledge Builder', emoji: '🧱', description: 'Add 1000 XP in a single week' },
    { id: 'focused-learner', name: 'Focused Learner', emoji: '🎯', description: 'Spend over an hour in exam mode', secret: true },
    { id: 'dedication', name: 'Dedication', emoji: '🙏', description: 'Log in every day for a month' },
    { id: 'polymath', name: 'Polymath', emoji: '🌍', description: 'Generate quizzes on 5 different topics' },
    { id: 'quick-learner', name: 'Quick Learner', emoji: '⚡️', description: 'Reach Level 3 in your first day', xpThreshold: 200 },
    { id: 'note-organizer', name: 'Note Organizer', emoji: '🗄️', description: 'Have notes with at least 5 different titles' },
    { id: 'study-marathon', name: 'Study Marathon', emoji: '🏃‍♂️', description: 'Generate more than 5 items (quizzes/decks) in a day' },
    { id: 'ai-collaborator', name: 'AI Collaborator', emoji: '🤝', description: 'Use every AI feature (quiz, flashcards, summary)' },
    { id: 'streak-saver', name: 'Streak Saver', emoji: '🆘', description: 'Log in on the last day of the week to save a streak', secret: true },
    { id: 'badge-hunter', name: 'Badge Hunter', emoji: '🏹', description: 'Unlock 10 badges' },
    { id: 'badge-collector', name: 'Badge Collector', emoji: '🎖️', description: 'Unlock 25 badges' },
    { id: 'badge-master', name: 'Badge Master', emoji: '🏅', description: 'Unlock 50 badges' },
    { id: 'unstoppable', name: 'Unstoppable', emoji: '🚀', description: 'Maintain a 365-day streak' },
    { id: 'true-fan', name: 'True Fan', emoji: '❤️', description: 'Use the app for 100 days' },
    { id: 'veteran', name: 'Veteran', emoji: '👴', description: 'One year anniversary of using the app', secret: true },
    { id: 'new-year', name: 'New Year, New Knowledge', emoji: '🎉', description: 'Log in on January 1st', secret: true },
    
    // 20 Secret Badges
    { id: 'secret-1', name: 'The Konami Code', emoji: '👾', description: 'You found a classic!', secret: true },
    { id: 'secret-2', name: '404', emoji: '❓', description: 'Badge not found... or is it?', secret: true },
    { id: 'secret-3', name: 'Time Traveler', emoji: '⏳', description: 'Someone likes to mess with the clock.', secret: true },
    { id: 'secret-4', name: 'Button Masher', emoji: '💥', description: 'You clicked a button 20 times in 10 seconds.', secret: true },
    { id: 'secret-5', name: 'Hidden Gem', emoji: '💎', description: 'You found a hidden feature.', secret: true },
    { id: 'secret-6', name: 'Full House', emoji: '🏠', description: 'You have 5 decks with 25+ cards each.', secret: true },
    { id: 'secret-7', name: 'The Phoenix', emoji: '🔥', description: 'You revived a streak after losing it.', secret: true },
    { id: 'secret-8', name: 'The Completionist', emoji: '✅', description: 'You have used every feature in the app.', secret: true },
    { id: 'secret-9', name: 'The Architect', emoji: '🏛️', description: 'You created a note with over 10,000 words.', secret: true },
    { id: 'secret-10', name: 'The Social Butterfly', emoji: '🦋', description: 'You shared your results (future feature).', secret: true },
    { id: 'secret-11', name: 'The Validator', emoji: '✔️', description: 'You reported a bug (future feature).', secret: true },
    { id: 'secret-12', name: 'The Philanthropist', emoji: '💖', description: 'You donated to the project (future feature).', secret: true },
    { id: 'secret-13', name: 'The Beta Tester', emoji: '🧪', description: 'You were part of the beta program.', secret: true },
    { id: 'secret-14', 'name': 'The First Follower', emoji: '🥇', description: 'You were one of the first 100 users.', secret: true },
    { id: 'secret-15', name: 'The Trendsetter', emoji: '📈', description: 'You suggested a feature that got implemented.', secret: true },
    { id: 'secret-16', name: 'The Minimalist', emoji: '🧘‍♀️', description: 'You only used one feature for a whole week.', secret: true },
    { id: 'secret-17', name: 'The Maximalist', emoji: '🎉', description: 'You used all features in a single day.', secret: true },
    { id: 'secret-18', name: 'The Insomniac', emoji: '☕', description: 'You were active on the app for 6 hours straight.', secret: true },
    { id: 'secret-19', name: 'The Challenger', emoji: '💪', description: 'You took 5 hard quizzes in a row.', secret: true },
    { id: 'secret-20', name: 'The One and Only', emoji: '🦄', description: 'This badge is unique to you.', secret: true },
];

const XP_PER_LEVEL = 100;

type GamificationContextType = {
  progress: ProgressData;
  addXp: (amount: number) => void;
  logAction: (actionType: keyof ProgressData['actions']) => void;
  getLevelDetails: () => { level: number, xpForNextLevel: number, progressPercentage: number };
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const defaultProgress: ProgressData = {
    xp: 0,
    streak: 0,
    lastLogin: new Date().toISOString().split('T')[0],
    badges: [],
    actions: {
      createNote: 0,
      generateQuiz: 0,
      createFlashcardDeck: 0,
      takeExam: 0,
    },
};

const ownerProgress: ProgressData = {
    xp: 100 * (100 -1), // Level 100
    streak: 365,
    lastLogin: new Date().toISOString().split('T')[0],
    badges: availableBadges, // All badges unlocked
    actions: {
      createNote: 50,
      generateQuiz: 50,
      createFlashcardDeck: 50,
      takeExam: 50,
    },
}

const judgeProgress: ProgressData = {
    xp: 750,
    streak: 10,
    lastLogin: new Date().toISOString().split('T')[0],
    badges: availableBadges.filter(b => 
        ['first-note', 'first-quiz', 'first-deck', 'level-2', 'level-5', 'streak-3', 'streak-7'].includes(b.id)
    ),
    actions: {
      createNote: 2,
      generateQuiz: 3,
      createFlashcardDeck: 1,
      takeExam: 1,
    },
};


export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const { toast } = useToast();
  const { isOwner, isJudge } = useApiKey();

  const checkForNewBadges = useCallback((updatedProgress: ProgressData) => {
    const newlyAwarded: Badge[] = [];
    const currentBadgeIds = new Set(updatedProgress.badges.map(b => b.id));

    for (const badge of availableBadges) {
        if (currentBadgeIds.has(badge.id)) continue;

        let unlocked = false;
        if (badge.xpThreshold && updatedProgress.xp >= badge.xpThreshold) {
            unlocked = true;
        } else if (badge.action && badge.countThreshold && updatedProgress.actions[badge.action] >= badge.countThreshold) {
            unlocked = true;
        } else if (badge.id.startsWith('streak-')) {
            const streakGoal = parseInt(badge.id.split('-')[1]);
            if (updatedProgress.streak >= streakGoal) unlocked = true;
        } else if (badge.id.startsWith('badge-')) {
            const badgeGoal = badge.id === 'badge-hunter' ? 10 : (badge.id === 'badge-collector' ? 25 : 50);
            if (updatedProgress.badges.length >= badgeGoal) unlocked = true;
        }
        
        if (unlocked) {
            newlyAwarded.push(badge);
        }
    }

    if (newlyAwarded.length > 0) {
        newlyAwarded.forEach(badge => {
            setTimeout(() => {
                toast({
                    title: 'New Badge Unlocked!',
                    description: (
                        <div className="flex items-center gap-3">
                            <span className="text-3xl animate-badge-pop">{badge.emoji}</span>
                            <span>You&apos;ve earned the &ldquo;{badge.name}&rdquo; badge!</span>
                        </div>
                    ),
                });
            }, 0);
        });
        return [...updatedProgress.badges, ...newlyAwarded];
    }
    return updatedProgress.badges;
  }, [toast]);

  const updateProgressState = useCallback((updater: (prev: ProgressData) => ProgressData) => {
    if (isOwner || isJudge) return; // Don't update progress for special roles
    setProgress(prev => {
        const updated = updater(prev);
        const newBadges = checkForNewBadges(updated);
        const finalProgress = { ...updated, badges: newBadges };
        
        if (JSON.stringify(finalProgress) !== JSON.stringify(prev)) {
            localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(finalProgress));
        }
        return finalProgress;
    });
  }, [checkForNewBadges, isOwner, isJudge]);
  
  useEffect(() => {
    if (isOwner) {
        setProgress(ownerProgress);
        return;
    }
    if (isJudge) {
        setProgress(judgeProgress);
        return;
    }

    const storedProgress = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    let currentProgress: ProgressData;
    if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        currentProgress = { ...defaultProgress, ...parsed, actions: { ...defaultProgress.actions, ...parsed.actions } };
    } else {
        currentProgress = defaultProgress;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = new Date(currentProgress.lastLogin);
    const todayDate = new Date(today);

    const diffTime = todayDate.getTime() - lastLoginDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let streakUpdated = false;
    if (diffDays === 1) {
        currentProgress.streak += 1;
        streakUpdated = true;
    } else if (diffDays > 1) {
        currentProgress.streak = 1;
    } else if (diffDays === 0 && currentProgress.streak === 0) {
        currentProgress.streak = 1;
    }
    
    currentProgress.lastLogin = today;

    updateProgressState(() => {
        if(streakUpdated && currentProgress.streak > 1) {
             setTimeout(() => {
                toast({ title: 'Streak Increased!', description: `You're on a ${currentProgress.streak}-day streak! 🔥`});
            }, 100);
        }
        return currentProgress;
    });

  }, [isOwner, isJudge, toast, updateProgressState]);

  const addXp = useCallback((amount: number) => {
    if (isOwner || isJudge) return;
    updateProgressState(prev => ({...prev, xp: prev.xp + amount }));
  }, [updateProgressState, isOwner, isJudge]);

  const logAction = useCallback((actionType: keyof ProgressData['actions']) => {
    if (isOwner || isJudge) return;
    updateProgressState(prev => {
        const newActionCount = (prev.actions[actionType] || 0) + 1;
        const newActions = { ...prev.actions, [actionType]: newActionCount };
        return { ...prev, actions: newActions, xp: prev.xp + 25 };
    });
  }, [updateProgressState, isOwner, isJudge]);

  const getLevelDetails = useCallback(() => {
    const level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;
    const currentLevelXp = (level - 1) * XP_PER_LEVEL;
    const xpIntoLevel = progress.xp - currentLevelXp;
    const progressPercentage = (xpIntoLevel / XP_PER_LEVEL) * 100;
    const xpForNextLevel = XP_PER_LEVEL - xpIntoLevel;
    
    return { level, xpForNextLevel, progressPercentage };
  }, [progress.xp]);


  return (
    <GamificationContext.Provider value={{ progress, addXp, logAction, getLevelDetails }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
