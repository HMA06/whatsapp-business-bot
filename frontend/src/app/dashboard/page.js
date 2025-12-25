"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [status, setStatus] = useState('جاري التحميل...');
  const [qr, setQr] = useState('');
  // الربط المحلي المباشر مع سيرفر الباك إند
  const API_URL = "http://localhost:3001"; 

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/whatsapp/qr`);
      if (res.data.qr) {
        setQr(res.data.qr);
        setStatus('يرجى مسح رمز QR للربط');
      } else {
        setStatus('جاهز للربط ✅');
      }
    } catch (e) { 
      setStatus('خطأ في الاتصال بالخادم'); 
    }
  };

  useEffect(() => { 
    checkStatus(); 
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#25D366' }}>SmartBiz WhatsApp Dashboard 🤖</h1>
      <div style={{ marginTop: '50px', padding: '40px', border: '1px solid #ddd', borderRadius: '15px', display: 'inline-block' }}>
        <h3>الحالة: {status}</h3>
        {qr && <img src={qr} alt="QR Code" style={{ width: '300px' }} />}
        {!qr && status === 'جاهز للربط ✅' && (
          <div style={{ color: '#25D366', fontWeight: 'bold' }}>البوت متصل بنجاح!</div>
        )}
      </div>
    </div>
  );
}