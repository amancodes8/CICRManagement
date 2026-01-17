import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Users, ArrowRight, Package, Loader2, Zap, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProjects, fetchMeetings, fetchMembers, fetchInventory } from '../api';

const StatCard = ({ title, value, icon: Icon, color, path, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Link to={path}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden bg-[#141417]/80 backdrop-blur-md border border-gray-800 p-6 rounded-[2rem] cursor-pointer hover:border-blue-500/50 transition-all shadow-2xl group"
      >
        {/* Animated Background Glow */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-30 ${color.split(' ')[0]}`} />
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tighter text-white">{value}</h3>
          </div>
          <div className={`p-4 rounded-2xl ${color} shadow-inner transition-transform group-hover:rotate-12`}>
            <Icon size={24} />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <TrendingUp size={12} className="text-green-500" />
          <span>Real-time Sync Active</span>
        </div>
      </motion.div>
    </Link>
  </motion.div>
);

export default function Dashboard() {
  const [data, setData] = useState({ 
    projects: [], 
    meetings: [], 
    members: [], 
    inventory: [], 
    loading: true 
  });

  const user = JSON.parse(localStorage.getItem('profile') || '{}');
  const userData = user.result || user;

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const [proj, meet, mem, inv] = await Promise.all([
          fetchProjects().catch(() => ({ data: [] })),
          fetchMeetings().catch(() => ({ data: [] })),
          fetchMembers().catch(() => ({ data: [] })),
          fetchInventory().catch(() => ({ data: [] }))
        ]);
        
        // Robust data extraction
        setData({
          projects: Array.isArray(proj.data) ? proj.data : (proj.data?.projects || []),
          meetings: Array.isArray(meet.data) ? meet.data : (meet.data?.meetings || []),
          members: Array.isArray(mem.data) ? mem.data : (mem.data?.users || []),
          inventory: Array.isArray(inv.data) ? inv.data : (inv.data?.items || []),
          loading: false
        });
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    getDashboardData();
  }, []);

  if (data.loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
      </div>
      <p className="text-gray-500 font-black text-xs uppercase tracking-widest animate-pulse">Initializing Neural Link...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-4 md:px-0">
      {/* --- HERO HEADER --- */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Core Status: Optimal</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Welcome back, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            {userData.name?.split(' ')[0] || 'Explorer'}
          </span>.
        </h2>
        <p className="text-gray-500 mt-4 text-lg font-medium max-w-2xl">
          The lab is currently buzzing with <span className="text-white font-bold">{data.projects.length} active missions</span> and {data.meetings.length} scheduled syncs.
        </p>
      </motion.header>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard index={0} title="Project Load" value={data.projects.length} icon={Activity} color="bg-blue-500/10 text-blue-500" path="/projects" />
        <StatCard index={1} title="Sync Sessions" value={data.meetings.length} icon={Clock} color="bg-purple-500/10 text-purple-500" path="/meetings" />
        <StatCard index={2} title="Lab Network" value={data.members.length} icon={Users} color="bg-amber-500/10 text-amber-500" path="/community" />
        <StatCard index={3} title="Hardware Cache" value={data.inventory.length} icon={Package} color="bg-emerald-500/10 text-emerald-500" path="/inventory" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- RECENT MISSIONS (PROJECTS) --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-[#141417]/50 backdrop-blur-md border border-gray-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <Star className="text-blue-500 fill-blue-500" size={20} />
              Mission Briefing
            </h3>
            <Link to="/projects" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-all">
              Launch Terminal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid gap-5">
             {data.projects.length > 0 ? data.projects.slice(0, 4).map((project, idx) => (
               <motion.div key={project._id} whileHover={{ x: 10 }}>
                 <Link to={`/projects/${project._id}`} className="group block p-6 bg-[#0a0a0c]/40 rounded-[2rem] border border-gray-800 hover:border-blue-500/40 transition-all hover:bg-[#0a0a0c]/60">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center font-black text-gray-700 group-hover:text-blue-500 transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors text-lg">{project.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-[10px]">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-black uppercase tracking-tighter">{project.domain || 'Lab'}</span>
                            <span className="text-gray-600 font-bold uppercase tracking-widest italic">{project.status || 'Active'}</span>
                          </div>
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-xl">
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-white" />
                     </div>
                   </div>
                 </Link>
               </motion.div>
             )) : (
               <p className="text-center py-10 text-gray-600 font-medium">No active missions found.</p>
             )}
          </div>
        </motion.section>

        {/* --- MEMBER PULSE (NEW FACES) --- */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 bg-[#141417]/30 border border-gray-800 rounded-[3rem] p-10 shadow-2xl flex flex-col"
        >
          <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
             <div className="w-2 h-8 bg-amber-500 rounded-full" />
             New Arrivals
          </h3>
          <div className="space-y-6 flex-1">
             {data.members.length > 0 ? data.members.slice(-5).reverse().map((member) => (
               <div key={member._id} className="flex items-center gap-5 group cursor-pointer">
                 <div className="w-14 h-14 rounded-2xl bg-[#0a0a0c] border border-gray-800 flex items-center justify-center font-black text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg overflow-hidden relative">
                    {member.name ? member.name[0] : 'U'}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-black text-gray-200 group-hover:text-blue-400 transition-colors truncate">{member.name}</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{member.role || 'Contributor'}</p>
                 </div>
                 <div className="h-2 w-2 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-all shadow-[0_0_8px_#22c55e]" />
               </div>
             )) : (
               <p className="text-center py-10 text-gray-600 text-xs">No new members yet.</p>
             )}
          </div>
          
          <Link to="/community" className="group flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[1.5rem] text-[11px] font-black text-white mt-10 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20">
             Network Directory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}