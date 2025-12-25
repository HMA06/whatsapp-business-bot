"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // تأكد من مسار ملف السوبابيس عندك
import { useRouter } from 'next/navigation';
import cookie from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (data?.user) {
      // جلب الرتبة من جدول الـ profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const role = profile?.role || 'Client';

      // حفظ التوكن والرتبة في الكوكيز ليعرفها الـ Middleware
      cookie.set('auth-token', data.session.access_token, { expires: 7 });
      cookie.set('user-role', role, { expires: 7 });

      // التوجيه حسب الرتبة
      if (role === 'Admin') router.push('/dashboard/admin');
      else if (role === 'Accountant') router.push('/dashboard/accounting');
      else router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1>تسجيل الدخول - SmartBiz 🤖</h1>
      <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="كلمة السر" onChange={(e) => setPassword(e.target.value)} /><br/>
      <button onClick={handleLogin}>دخول</button>
    </div>
  );
}