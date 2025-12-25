export const metadata = {
  title: 'SmartBiz Dashboard',
  description: 'WhatsApp Bot Management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ 
        margin: 0, 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f0f2f5',
        minHeight: '100vh' 
      }}>
        {children}
      </body>
    </html>
  )
}