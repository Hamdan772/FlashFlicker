import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'FlashFlicker - AI-Powered Study Platform'
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
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          FlashFlicker
        </div>
        <div
          style={{
            fontSize: 32,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            opacity: 0.9,
          }}
        >
          AI-Powered Study Platform | Smart Flashcards, Quizzes & Study Tools
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            opacity: 0.7,
          }}
        >
          Transform Your Learning Journey
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}