import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/notes/new', '/dashboard/notes/edit'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/notes/new', '/dashboard/notes/edit'],
      },
    ],
    sitemap: 'https://flash-flicker.vercel.app/sitemap.xml',
  }
}