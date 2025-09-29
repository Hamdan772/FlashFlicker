# FlashFlicker

A modern study companion app built with Next.js, featuring AI-powered flashcards, coaching, and study tools.

## Features

- 📚 AI-powered flashcard generation
- 🎯 Personalized study coaching
- 📝 Smart note-taking with rich text editor
- 🧠 Interactive quizzes
- ⏰ Study reminders
- 🎮 Gamified learning experience
- 🌙 Dark/light theme support

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd FlashFlicker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your API keys:
- `GEMINI_API_KEY`: Your Google Gemini AI API key

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Deploy to Vercel

This app is ready for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini AI API key
4. Deploy!

The build process will automatically run `npm run build` and deploy your app.

### Environment Variables

Make sure to set these environment variables in your Vercel dashboard:

- `GEMINI_API_KEY`: Required for AI features

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

## Tech Stack

- **Framework**: Next.js 15.3.3
- **UI**: React 18, Tailwind CSS, Radix UI
- **AI**: Google Gemini AI via Genkit
- **Rich Text**: TipTap
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Styling**: Tailwind CSS with custom animations
- **Theme**: Next-themes for dark/light mode

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── dashboard/      # Dashboard pages (notes, flashcards, etc.)
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/ui components
├── hooks/             # Custom React hooks  
├── lib/               # Utility functions
└── ai/                # AI flows and configurations
```
