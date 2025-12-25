"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("جاهز للربط");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://supportably-illiberal-eura.ngrok-free.dev";

  // دالة لجلب الرمز الحالي من السيرفر
  const fetchQr = async () => {
    try {
      const res = await axios.get(`${API_URL}/whatsapp/qr`);
      if (res.data && res.data.qr) {
        setQr(res.data.qr);
        setStatus("تم استقبال الرمز بنجاح ✅");
      }
    } catch (err) {
      console.log("الرمز غير جاهز بعد...");
    }
  };

  const startConnection = async () => {
    setLoading(true);
    setQr("");
    setStatus("جاري بدء الاتصال وتوليد الرمز...");
    try {
      // إرسال طلب البدء
      await axios.post(`${API_URL}/whatsapp/connect`, { tenantId: 1 });
    } catch (err) {
      setStatus("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // ميزة التحديث التلقائي: إذا كان هناك اتصال يبدأ، ابحث عن الرمز كل ثانيتين
  useEffect(() => {
    let interval;
    if (!qr && (status.includes("جاري") || status.includes("انتظر"))) {
      interval = setInterval(fetchQr, 2000);
    }
    return () => clearInterval(interval);
  }, [qr, status]);

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#25D366' }}>SmartBiz WhatsApp Dashboard 🤖</h1>
      
      <div style={{ marginTop: '20px', padding: '30px', border: '1px solid #ddd', borderRadius: '15px', display: 'inline-block', backgroundColor: '#fff' }}>
        <p>الحالة: <strong>{status}</strong></p>
        
        {qr && (
          <div style={{ marginTop: '20px' }}>
            <img src={qr} alt="WhatsApp QR" style={{ width: '256px', border: '5px solid #25D366', borderRadius: '10px' }} />
            <p style={{ marginTop: '10px' }}>امسح الكود الآن من هاتفك</p>
          </div>
        )}

        {!qr && (
          <button 
            onClick={startConnection} 
            disabled={loading}
            style={{ padding: '12px 25px', cursor: 'pointer', backgroundColor: loading ? '#ccc' : '#25D366', color: 'white', border: 'none', borderRadius: '8px' }}
          >
            {loading ? 'انتظر ظهور الرمز...' : 'بدء الاتصال بالواتساب'}
          </button>
        )}
      </div>
    </div>
  );
}