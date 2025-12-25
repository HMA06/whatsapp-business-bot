"use client";
import { useState } from 'react';
import axios from 'axios';

export default function KnowledgeBase() {
  const [newData, setNewData] = useState({ question: '', answer: '' });
  const API_URL = "http://localhost:3001"; // الربط المباشر

  const handleSaveText = async () => {
    if (!newData.question || !newData.answer) {
      alert("يرجى إدخال السؤال والإجابة");
      return;
    }
    try {
      // إرسال البيانات للباك إند
      await axios.post(`${API_URL}/tenants/1/knowledge`, newData);
      setNewData({ question: '', answer: '' });
      alert("تم تحديث عقل البوت بنجاح! 🧠✨");
    } catch (e) { 
      alert("حدث خطأ في الحفظ، تأكد من تشغيل الباك إند"); 
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial', direction: 'rtl' }}>
      <h1 style={{ color: '#0070f3' }}>مركز تدريب الذكاء الاصطناعي 🧠</h1>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h3>إضافة معلومة جديدة</h3>
        <input 
          placeholder="السؤال..." 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          value={newData.question}
          onChange={(e) => setNewData({...newData, question: e.target.value})}
        />
        <textarea 
          placeholder="الإجابة..." 
          style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '10px' }}
          value={newData.answer}
          onChange={(e) => setNewData({...newData, answer: e.target.value})}
        />
        <button onClick={handleSaveText} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          حفظ في قاعدة البيانات
        </button>
      </div>
    </div>
  );
}