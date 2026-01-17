import { useState } from 'react';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';
import axios from 'axios';

export default function AISummarizer() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! Paste a Project ID to get a smart summary.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const { data } = await axios.post('http://localhost:4000/api/ai/summarize', { 
        projectId: userMsg 
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: data.summary }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: Could not find that project.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="text-blue-500 animate-pulse" size={32} />
        <h2 className="text-3xl font-bold">CICR AI Assistant</h2>
      </div>

      <div className="bg-[#141417] border border-gray-800 rounded-3xl h-[600px] flex flex-col shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'bot' ? 'bg-[#1c1c21] border border-gray-800 text-gray-200' : 'bg-blue-600 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center animate-bounce">
                <Bot size={16} />
              </div>
              <div className="bg-[#1c1c21] p-4 rounded-2xl"><Loader2 className="animate-spin text-blue-500" /></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-800 bg-[#1c1c21]/50 rounded-b-3xl">
          <div className="flex space-x-3">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-[#0a0a0c] border border-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              placeholder="Paste Project ID here..."
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 px-6 rounded-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}