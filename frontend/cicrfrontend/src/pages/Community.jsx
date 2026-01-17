import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Send, Users, Search, 
  Trash2, Megaphone, Lightbulb, Mail, 
  Loader2, Sparkles, MapPin, ExternalLink,
  ChevronRight, Hash, Globe, Fingerprint, GraduationCap 
} from 'lucide-react';
import { fetchMembers, fetchPosts, createPost, likePost, deletePost } from '../api';

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed'); 
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('Announcement');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');

  const user = JSON.parse(localStorage.getItem('profile') || '{}');
  const userData = user.result || user;
  const isAdmin = userData.role?.toLowerCase() === 'admin' || userData.role?.toLowerCase() === 'head';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pRes, mRes] = await Promise.all([fetchPosts(), fetchMembers()]);
      setPosts(pRes.data);
      setMembers(mRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const { data } = await createPost({ content, type: postType });
      setPosts([data, ...posts]);
      setContent('');
    } catch (err) { alert("Failed to post"); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) { alert("Error deleting post"); }
  };

  const filteredMembers = members.filter(m => 
    (m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.collegeId?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterBranch === 'All' || m.branch === filterBranch)
  );

  // Helper for Year Ordinals (1st, 2nd, etc)
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      <p className="text-gray-500 font-black tracking-[0.2em] uppercase text-[10px]">Synchronizing Hub...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-12 min-h-screen overflow-x-hidden">
      
      {/* GLOSS HEADER */}
      <header className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#141417] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-600/10 blur-[80px] md:blur-[100px] rounded-full -mr-10 -mt-10" />
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="bg-blue-600/20 text-blue-500 p-2 rounded-xl"><Globe size={20}/></span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Hub Network</h2>
            </div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Connecting the brightest minds in CICR Lab</p>
          </div>

          <div className="flex w-full md:w-auto bg-[#0a0a0c] p-1 rounded-2xl border border-gray-800 shadow-inner">
            {[{ id: 'feed', icon: MessageSquare, label: 'Feed' }, { id: 'directory', icon: Users, label: 'Directory' }].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'feed' ? (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* POST INPUT */}
              <form onSubmit={handlePostSubmit} className="bg-[#141417] border border-gray-800 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl">
                <div className="flex gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-800 flex-shrink-0 items-center justify-center font-black text-blue-500 text-xl border border-gray-700">
                    {userData.name?.[0]}
                  </div>
                  <textarea 
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a thread or requirement..."
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 text-base md:text-lg py-2 resize-none outline-none"
                    rows="3"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-800 gap-4">
                  <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 scrollbar-hide">
                    {['Announcement', 'Requirement', 'Idea'].map(type => (
                      <button key={type} type="button" onClick={() => setPostType(type)} className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase border transition-all ${postType === type ? 'bg-blue-600/20 border-blue-500 text-blue-500' : 'border-gray-800 text-gray-500'}`}>{type}</button>
                    ))}
                  </div>
                  <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"><Send size={16} /> Post</button>
                </div>
              </form>

              {/* POSTS */}
              <div className="space-y-6">
                {posts.map((post, idx) => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} key={post._id} className="bg-[#141417] border border-gray-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white">{post.user?.name?.[0]}</div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-white font-bold text-sm md:text-base">{post.user?.name}</h4>
                            <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">{post.type}</span>
                          </div>
                          {/* META INFO IN POST HEADER */}
                          <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                            {post.user?.branch} • Year {post.user?.year} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {(isAdmin || post.user?._id === userData.id) && (
                        <button onClick={() => handleDelete(post._id)} className="text-gray-600 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                      )}
                    </div>
                    <div className="mt-4 md:mt-6 text-gray-300 text-sm md:text-base leading-relaxed">{post.content}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* SIDEBAR */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#141417] border border-gray-800 p-8 rounded-[2rem]">
                <h3 className="font-black mb-6 flex items-center gap-3 text-white uppercase italic tracking-widest text-sm">
                  <Sparkles size={18} className="text-blue-500" /> Lab Trending
                </h3>
                <div className="space-y-3">
                  {['Server Upgrade', 'Weekend Hackathon', 'New Components'].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0c] border border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item} <ChevronRight size={14} /></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- DIRECTORY VIEW --- */
          <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-4 bg-[#141417] p-6 rounded-[2rem] border border-gray-800">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Search name or Reg No..." className="w-full bg-[#0a0a0c] border border-gray-800 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-blue-500" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select onChange={(e) => setFilterBranch(e.target.value)} className="bg-[#0a0a0c] border border-gray-800 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400">
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="ECS">ECS</option><option value="ECM">ECM</option><option value="BCA">BCA</option><option value="MCA">MCA</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div key={member._id} className="bg-[#141417] border border-gray-800 p-6 md:p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-[9px] bg-blue-600/10 text-blue-500 px-2 py-1 rounded-md font-black uppercase">{member.branch || 'LAB'}</span>
                  </div>

                  <div className="w-14 h-14 bg-[#0a0a0c] border border-gray-800 rounded-2xl mb-4 flex items-center justify-center font-black text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {member.name?.[0]}
                  </div>

                  <h4 className="text-white font-black text-lg truncate mb-1">{member.name}</h4>
                  
                  {/* NEW DATA: REG NO & YEAR */}
                  <div className="space-y-2 mb-6 mt-3">
                     <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold">
                        <Fingerprint size={12} className="text-blue-500" />
                        <span>ID: {member.collegeId || 'NO-ID'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                        <GraduationCap size={12} className="text-amber-500" />
                        <span>{member.year ? `${member.year}${getOrdinal(member.year)} Year` : 'Year N/A'}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800 space-y-3">
                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-300">
                      <Mail size={12} className="text-blue-500" />
                      <span className="text-[10px] font-bold truncate">{member.email}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                    View Profile <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}