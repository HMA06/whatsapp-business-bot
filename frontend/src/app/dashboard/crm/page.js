"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CRMDashboard() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase.from('conversations').select('*').limit(10);
      setChats(data || []);
    };
    fetchChats();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#25D366' }}>مركز خدمة العملاء 💬</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
          <h4>المحادثات النشطة</h4>
          {chats.map(chat => (
            <div key={chat.id} style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
              <strong>{chat.customer_phone}</strong>
              <p style={{ fontSize: '12px', color: '#666' }}>{chat.last_message?.slice(0, 30)}...</p>
            </div>
          ))}
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p>اختر محادثة من اليمين للبدء في الرد اليدوي</p>
        </div>
      </div>
    </div>
  );
}