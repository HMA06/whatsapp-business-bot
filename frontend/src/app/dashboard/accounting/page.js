"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountingDashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data } = await supabase.from('invoices').select('*');
      setInvoices(data || []);
    };
    fetchInvoices();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#2c3e50' }}>قسم المحاسبة والمالية 💰</h1>
      <div style={{ marginTop: '20px' }}>
        <h3>قائمة الفواتير الأخيرة</h3>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th>رقم الفاتورة</th>
              <th>الشركة</th>
              <th>المبلغ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} style={{ textAlign: 'center' }}>
                <td>#{inv.id.slice(0,8)}</td>
                <td>{inv.tenant_name}</td>
                <td>${inv.amount}</td>
                <td style={{ color: inv.status === 'paid' ? 'green' : 'red' }}>
                  {inv.status === 'paid' ? 'مدفوعة' : 'معلقة'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}