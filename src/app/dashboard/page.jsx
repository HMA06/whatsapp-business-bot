"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("جاهز للربط");
  const [loading, setLoading] = useState(false);

  // رابط نفق ngrok الخاص بك
  const API_URL = "https://supportably-illiberal-eura.ngrok-free.dev";

  const startConnection = async () => {
    setLoading(true);
    setStatus("جاري طلب الرمز من السيرفر...");
    try {
      const res = await axios.post(`${API_URL}/whatsapp/connect`, { tenantId: 1 });
      if (res.data && res.data.qr) {
        setQr(res.data.qr);
        setStatus("تم توليد الرمز! امسحه الآن ✅");
      } else {
        setStatus("جاري التوليد.. انتظر 5 ثوانٍ واضغط 'تحديث الرمز'");
      }
    } catch (err) {
      setStatus("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const refreshQr = async () => {
    try {
      const res = await axios.get(`${API_URL}/whatsapp/qr`);
      if (res.data.qr) setQr(res.data.qr);
    } catch (err) { console.log("QR not ready yet"); }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#25D366' }}>SmartBiz WhatsApp Dashboard 🤖</h1>
      
      <div style={{ marginTop: '20px', padding: '30px', border: '1px solid #ddd', borderRadius: '15px', display: 'inline-block', backgroundColor: '#fff' }}>
        <p>الحالة: <strong>{status}</strong></p>
        
        {qr && (
          <div style={{ marginTop: '20px' }}>
            <img src={qr} alt="WhatsApp QR" style={{ width: '256px', border: '5px solid #25D366', borderRadius: '10px' }} />
            <p style={{ marginTop: '10px' }}>امسح الكود من هاتفك</p>
            <button onClick={refreshQr} style={{ marginTop: '10px', fontSize: '12px' }}>تحديث الرمز 🔄</button>
          </div>
        )}

        {!qr && (
          <button 
            onClick={startConnection} 
            disabled={loading}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: loading ? '#ccc' : '#25D366', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            {loading ? 'انتظر...' : 'بدء الاتصال بالواتساب'}
          </button>
        )}
      </div>
    </div>
  );
}
