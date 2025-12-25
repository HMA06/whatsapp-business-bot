"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CRMDashboard() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const API_URL = "https://supportably-illiberal-eura.ngrok-free.dev";

  const fetchMessages = async () => {
    const res = await axios.get(`${API_URL}/tenants/1/messages`);
    setMessages(res.data || []);
  };

  const handleSend = async () => {
    await axios.post(`${API_URL}/whatsapp/send-manual`, {
      tenantId: 1, to: selectedChat, message: reply
    });
    setReply("");
    alert("تم إرسال الرد اليدوي بنجاح!");
    fetchMessages();
  };

  useEffect(() => { 
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // تحديث تلقائي كل 5 ثوانٍ
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', height: '80vh', gap: '20px', padding: '20px' }}>
      {/* قائمة المحادثات */}
      <div style={{ flex: 1, border: '1px solid #ddd', overflowY: 'auto', borderRadius: '10px' }}>
        <h3 style={{ padding: '10px' }}>المحادثات الأخيرة 💬</h3>
        {messages.map((m, i) => (
          <div key={i} onClick={() => setSelectedChat(m.from)} style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedChat === m.from ? '#e6f7ff' : 'transparent' }}>
            <strong>{m.from}</strong>
            <p style={{ fontSize: '12px', color: '#666' }}>{m.body.slice(0, 30)}...</p>
          </div>
        ))}
      </div>

      {/* منطقة الدردشة والرد */}
      <div style={{ flex: 2, border: '1px solid #ddd', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            <h3>الدردشة مع: {selectedChat}</h3>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              {/* هنا ستظهر فقاعات الدردشة لاحقاً */}
              <p>آخر رسالة: {messages.find(m => m.from === selectedChat)?.body}</p>
              <p style={{ color: '#25D366' }}>رد البوت: {messages.find(m => m.from === selectedChat)?.reply}</p>
            </div>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتب ردك اليدوي هنا..." style={{ width: '100%', height: '100px', padding: '10px' }} />
            <button onClick={handleSend} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', cursor: 'pointer' }}>إرسال الآن</button>
          </>
        ) : <p>اختر محادثة للبدء في الرد</p>}
      </div>
    </div>
  );
}