"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const { data } = await supabase.from('tenants').select('*');
      setTenants(data || []);
    };
    fetchTenants();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#0070f3' }}>لوحة تحكم المدير العام 🛡️</h1>
      <h3>إجمالي الشركات المشتركة: {tenants.length}</h3>
      <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>اسم الشركة</th>
            <th>تاريخ الاشتراك</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>{t.isActive ? 'نشط ✅' : 'متوقف ❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}