import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'FlashFlicker - AI Study Tools'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 50,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 'bold',
            marginBottom: 15,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          FlashFlicker
        </div>
        <div
          style={{
            fontSize: 28,
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.3,
            opacity: 0.95,
          }}
        >
          Smart AI Study Tools for Academic Success
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 22,
            opacity: 0.8,
          }}
        >
          🧠 Flashcards • 📝 Quizzes • 🎯 AI Coaching
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}