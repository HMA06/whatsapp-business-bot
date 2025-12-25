"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function KnowledgeBase() {
  const [knowledge, setKnowledge] = useState([]);
  const [newData, setNewData] = useState({ question: '', answer: '' });
  const [file, setFile] = useState(null);
  const API_URL = "https://supportably-illiberal-eura.ngrok-free.dev"; 

  // جلب البيانات المخزنة
  const fetchKnowledge = async () => {
    try {
      const res = await axios.get(`${API_URL}/tenants/1/knowledge`);
      setKnowledge(res.data || []);
    } catch (e) { console.error("Error fetching knowledge"); }
  };

  // حفظ نص يدوي
  const handleSaveText = async () => {
    await axios.post(`${API_URL}/tenants/1/knowledge`, newData);
    setNewData({ question: '', answer: '' });
    fetchKnowledge();
    alert("تم تحديث عقل البوت بالنص الجديد! 🧠");
  };

  // رفع ملف PDF
  const handleUploadPdf = async () => {
    if (!file) return alert("الرجاء اختيار ملف أولاً");
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`${API_URL}/tenants/1/upload-pdf`, formData);
    alert("تم معالجة ملف الـ PDF وتدريب البوت بنجاح! 📄✅");
    fetchKnowledge();
  };

  useEffect(() => { fetchKnowledge(); }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>مركز تدريب الذكاء الاصطناعي 🧠</h1>
      
      {/* قسم النصوص */}
      <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
        <h3>إضافة معلومة نصية</h3>
        <input placeholder="السؤال" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} value={newData.question} onChange={(e) => setNewData({...newData, question: e.target.value})} />
        <textarea placeholder="الإجابة" style={{ width: '100%', padding: '10px', height: '80px' }} value={newData.answer} onChange={(e) => setNewData({...newData, answer: e.target.value})} />
        <button onClick={handleSaveText} style={{ marginTop: '10px', backgroundColor: '#0070f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>حفظ النص</button>
      </div>

      {/* قسم الـ PDF */}
      <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f0f7ff' }}>
        <h3>رفع ملف PDF (كتيب الشركة/الأسعار)</h3>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUploadPdf} style={{ marginTop: '10px', backgroundColor: '#25D366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>تحليل الملف ورفعه</button>
      </div>

      <h3>المعلومات الحالية:</h3>
      {knowledge.map((item, index) => (
        <div key={index} style={{ backgroundColor: '#f9f9f9', padding: '15px', marginBottom: '10px', borderRadius: '5px', borderLeft: '5px solid #25D366' }}>
          <strong>س: {item.question}</strong>
          <p>ج: {item.answer}</p>
        </div>
      ))}
    </div>
  );
}