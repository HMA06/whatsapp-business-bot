"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // استيراد مكتبة الرسم

export default function Dashboard() {
  const [status, setStatus] = useState('جاري التحميل...');
  const [qr, setQr] = useState('');
  
  // التأكد من الربط مع منفذ الباك إند الصحيح في الدوكر
  const API_URL = "http://localhost:3001"; 

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/whatsapp/qr`);
      
      // إذا كان السيرفر يرسل كود (نص خام)، نقوم بتخزينه
      if (res.data.qr && res.data.qr !== "CONNECTED") {
        setQr(res.data.qr);
        setStatus('يرجى مسح رمز QR للربط');
      } 
      // إذا كانت الحالة متصل
      else if (res.data.qr === "CONNECTED") {
        setQr('');
        setStatus('جاهز للربط ✅');
      }
      // إذا كان السيرفر لا يزال يهيئ المحرك
      else {
        setQr('');
        setStatus('جاري تهيئة محرك الواتساب... انتظر لحظة');
      }
    } catch (e) { 
      setStatus('خطأ في الاتصال بالخادم (تأكد من تشغيل الدوكر)'); 
    }
  };

  useEffect(() => { 
    checkStatus(); 
    // تحديث الحالة كل 5 ثوانٍ لضمان سرعة ظهور الكود
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px', fontFamily: 'Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#25D366' }}>SmartBiz WhatsApp Dashboard 🤖</h1>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '40px', 
        backgroundColor: 'white',
        border: '1px solid #ddd', 
        borderRadius: '15px', 
        display: 'inline-block',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>الحالة: {status}</h3>
        
        {/* رسم الـ QR Code باستخدام المكتبة بدلاً من وسم الصورة المكسورة */}
        {qr && (
          <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #eee' }}>
            <QRCodeCanvas value={qr} size={256} level="H" includeMargin={true} />
            <p style={{ marginTop: '10px', color: '#666' }}>امسح الكود عبر تطبيق واتساب</p>
          </div>
        )}

        {!qr && status === 'جاهز للربط ✅' && (
          <div style={{ color: '#25D366', fontWeight: 'bold', fontSize: '1.2rem' }}>
            🚀 البوت متصل الآن ومستعد للعمل!
          </div>
        )}
        
        {!qr && status.includes('تهيئة') && (
          <div style={{ color: '#666' }}>راقب نافذة الـ CMD (Backend) لرؤية تقدم التشغيل...</div>
        )}
      </div>
    </div>
  );
}