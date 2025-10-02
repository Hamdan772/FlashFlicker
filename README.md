# 📚 FlashFlicker

> **Your AI-Powered Study Companion**

FlashFlicker is a comprehensive, modern study platform that transforms how you learn. Built with Next.js 15 and powered by Google's Gemini AI, it offers personalized learning experiences through intelligent flashcards, interactive coaching, and gamified progress tracking.

## ✨ Key Features

### 🧠 **AI-Powered Learning Tools**
- **Smart Flashcard Generation**: Transform any text into interactive flashcards with AI
- **Personalized Study Coach**: Get tailored study advice and motivation
- **Intelligent Quiz Creation**: Generate custom quizzes from your study materials
- **Content Summarization**: AI-powered note summarization and insights

### 📚 **Study Management**
- **Rich Text Notes**: Advanced note-taking with formatting, lists, and organization
- **Study Reminders**: Never miss a study session with smart notifications
- **Progress Tracking**: Visual charts and analytics for your learning journey
- **File Upload Support**: Import PDFs, documents, and images for studying

### 🎮 **Gamification System**
- **70+ Achievement Badges**: Unlock badges for various study milestones
- **XP & Levels**: Earn experience points and level up your learning
- **Streak Tracking**: Maintain daily study streaks for extra rewards
- **Leaderboards**: Compare progress with other learners (coming soon)

### 🎨 **Modern Interface**
- **Dark/Light Themes**: Comfortable studying in any lighting
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Accessible UI**: Built with accessibility standards in mind
- **Smooth Animations**: Delightful micro-interactions throughout the app

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Gemini API Key**: Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hamdan772/FlashFlicker.git
   cd FlashFlicker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up your API key**
   - Launch the development server: `npm run dev`
   - Open [http://localhost:3000](http://localhost:3000)
   - Click the red key icon in the top navigation
   - Enter your Gemini API key or use shortcuts:
     - Type `"owner"` for full access with demo data
     - Type `"judge"` or `"test"` for evaluation mode

4. **Start learning!**
   ```bash
   npm run dev
   ```

### 🎯 First Steps
1. **Create your first flashcard deck** from any text or document
2. **Take a quiz** to test your knowledge
3. **Chat with your AI study coach** for personalized guidance
4. **Track your progress** in the dashboard

## 🚀 Deployment

### Deploy to Vercel (Recommended)

FlashFlicker is optimized for deployment on Vercel:

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js configuration

3. **Configure Environment Variables** (Optional)
   - In your Vercel dashboard, go to Settings > Environment Variables
   - Add `GEMINI_API_KEY` if you want server-side API key management
   - Otherwise, users can enter their API keys directly in the app

4. **Deploy!**
   - Click "Deploy" and watch your app go live
   - Vercel will provide you with a production URL

### Alternative Deployment Options

| Platform | Configuration | Notes |
|----------|---------------|--------|
| **Netlify** | `netlify.toml` included | Static export compatible |
| **Railway** | `Dockerfile` ready | Full-stack deployment |
| **DigitalOcean** | App Platform compatible | Container-based deployment |
| **Self-hosted** | Docker support | Complete control over infrastructure |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No* | Server-side API key (optional - users can enter their own) |
| `NODE_ENV` | Auto | Automatically set by hosting platforms |

*Users can enter API keys directly in the application interface.

## 📱 Browser Support

FlashFlicker works on all modern browsers:

- ✅ **Chrome** 90+
- ✅ **Firefox** 88+  
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ✅ **Mobile Safari** iOS 14+
- ✅ **Chrome Mobile** Android 90+

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Run tests**: `npm run typecheck && npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add TypeScript types for all new code
- Test your changes thoroughly
- Update documentation as needed
- Ensure all linting passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for the powerful Gemini API
- **Vercel** for the amazing Next.js framework
- **Radix UI** for accessible component primitives
- **The open-source community** for all the amazing tools and libraries

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via [GitHub Issues](https://github.com/Hamdan772/FlashFlicker/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/Hamdan772/FlashFlicker/discussions)

---

<div align="center">
  <p><strong>Built with ❤️ for learners everywhere</strong></p>
  <p>Made by <a href="https://github.com/Hamdan772">@Hamdan772</a></p>
</div>

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start Genkit AI development server |
| `npm run genkit:watch` | Start Genkit with file watching |

### 🔧 API Key Management

FlashFlicker includes a sophisticated API key management system:

- **Secure Storage**: Keys are encrypted and stored locally in your browser
- **Auto-Save**: No need to re-enter your key on each visit
- **Quick Access Shortcuts**: Use predefined shortcuts for testing and demos
- **Validation**: Built-in validation ensures your key is properly formatted

### 🏗️ Architecture

FlashFlicker is built with modern web technologies and best practices:

- **App Router**: Uses Next.js 15's latest app directory structure
- **Server Components**: Optimized performance with server-side rendering
- **Type Safety**: Full TypeScript coverage for robust development
- **AI Integration**: Genkit framework for seamless AI feature development

## 💻 Tech Stack

### Core Framework
- **[Next.js 15.5.4](https://nextjs.org/)** - Full-stack React framework with Turbopack
- **[React 18](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development experience

### AI & Backend
- **[Google Gemini AI](https://ai.google.dev/)** - Advanced AI for content generation
- **[Genkit](https://firebase.google.com/products/genkit)** - AI workflow management
- **[Zod](https://zod.dev/)** - Runtime type validation and parsing

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled UI primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful, customizable icons
- **[TipTap](https://tiptap.dev/)** - Rich text editor for notes
- **[Recharts](https://recharts.org/)** - Data visualization library

### Developer Experience
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Prettier](https://prettier.io/)** - Code formatting (implied)
- **Turbopack** - Ultra-fast bundler for development

## 📁 Project Structure

```
FlashFlicker/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 dashboard/          # Main dashboard pages
│   │   │   ├── 📂 flashcards/     # Flashcard management
│   │   │   ├── 📂 coach/          # AI study coaching
│   │   │   ├── 📂 quizzes/        # Quiz generation & taking
│   │   │   ├── 📂 notes/          # Note-taking system
│   │   │   ├── 📂 data/           # Progress analytics
│   │   │   └── 📂 rewards/        # Gamification dashboard
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Landing page
│   ├── 📂 components/             # Reusable UI components
│   │   ├── 📂 ui/                 # Shadcn/ui component library
│   │   ├── api-key-manager.tsx    # API key management
│   │   ├── rich-text-editor.tsx   # Note editor component
│   │   └── theme-provider.tsx     # Theme management
│   ├── 📂 hooks/                  # Custom React hooks
│   │   ├── use-api-key.tsx        # API key state management
│   │   ├── use-gamification.tsx   # Badge & XP system
│   │   └── use-toast.ts           # Toast notifications
│   ├── 📂 lib/                    # Utility functions
│   │   ├── storage.ts             # Local storage management
│   │   ├── utils.ts               # General utilities
│   │   └── nav-links.ts           # Navigation configuration
│   └── 📂 ai/                     # AI integration layer
│       ├── 📂 flows/              # AI workflow definitions
│       │   ├── generate-flashcards.ts
│       │   ├── generate-quiz.ts
│       │   ├── chat-with-coach.ts
│       │   └── summarize-note.ts
│       └── genkit.ts              # Genkit configuration
├── 📂 docs/                       # Documentation
├── 📄 components.json             # Shadcn/ui configuration
├── 📄 tailwind.config.ts          # Tailwind CSS configuration
├── 📄 next.config.ts              # Next.js configuration
└── 📄 package.json               # Project dependencies
```

## 🎮 Gamification Features

FlashFlicker includes a comprehensive gamification system to keep you motivated:

### 🏆 Achievement System
- **70+ Unique Badges**: From "First Steps" to "Study Master"
- **Category-Based**: Badges for flashcards, quizzes, notes, and more
- **Progressive Unlocking**: Achieve milestones to unlock new challenges

### 📊 Progress Tracking
- **XP System**: Earn experience points for every study activity
- **Level Progression**: Watch your level increase as you learn
- **Streak Counters**: Track daily, weekly, and monthly study habits
- **Visual Analytics**: Beautiful charts showing your learning journey

### 🎯 Special Features
- **Konami Code**: Hidden easter eggs and bonus rewards
- **Time-Based Rewards**: Extra XP for consistent study sessions
- **Social Elements**: Share achievements (coming soon)
