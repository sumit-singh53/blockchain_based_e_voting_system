import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listElections } from "../../services/electionService";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Activity, FileText, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listElections()
      .then((r) => setElections(r.data))
      .catch(() => setError("Could not load elections."))
      .finally(() => setLoading(false));
  }, []);

  const activeElections = elections.filter(e => e.status === "active");
  const completedElections = elections.filter(e => e.status === "completed" || e.status === "archived");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] min-h-screen">
      
      {/* Friendly Hero Introduction */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="relative p-10 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden"
      >
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
         
         <div className="relative z-10 space-y-4 max-w-2xl">
           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
             Welcome to your <br className="hidden sm:block" /> Digital Ballot.
           </h1>
           <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
             Review candidate platforms, cast your cryptographically secure vote, and participate directly in your local governance.
           </p>
           
           <div className="pt-4 flex items-center gap-3">
             <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 flex items-center gap-2 w-max">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                 Voter ID Connected
               </span>
             </div>
             <span className="text-xs font-mono text-slate-400">
               {user?.voter_id ? `${user.voter_id.substring(0, 16)}...` : "Loading..."}
             </span>
           </div>
         </div>
      </motion.div>

      {/* Actionable Elections */}
      <div className="space-y-6">
         <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-4 h-4" />
            </span>
            Elections Open for Voting
         </h2>

         {loading && (
            <div className="grid gap-6 sm:grid-cols-2">
               {[1, 2].map(i => (
                 <div key={i} className="h-56 bg-white/50 dark:bg-slate-800/30 animate-pulse rounded-[2rem] border border-slate-100 dark:border-white/5" />
               ))}
            </div>
         )}
         
         {!loading && activeElections.length === 0 && (
            <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-white/5 rounded-[2.5rem]">
               <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Open Ballots</h3>
               <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later for new elections in your district.</p>
            </div>
         )}

         <motion.div 
           initial="hidden" animate="visible"
           variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
           className="grid gap-6 sm:grid-cols-2"
         >
           {activeElections.map((el) => (
             <motion.div 
               variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
               key={el.election_id} 
               className="group flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 p-8"
             >
               <div className="mb-6">
                 <div className="flex items-center gap-2 mb-3">
                   <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                   <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Now</span>
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{el.name}</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                   {el.description || "Review the candidates and submit your ballot for this active election."}
                 </p>
               </div>
               
               <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 bg-slate-50 dark:bg-white/5 p-3 rounded-xl w-max">
                 <Calendar className="w-4 h-4" />
                 Closes: {el.end_date ? new Date(el.end_date).toLocaleDateString() : "TBD"}
               </div>

               <div className="mt-auto">
                 <Link
                   to={`/voter/vote?election=${el.election_id}`}
                   className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-4 rounded-2xl font-bold transition-all group-hover:shadow-lg active:scale-[0.98]"
                 >
                   <span>Review & Cast Vote</span>
                   <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </Link>
               </div>
             </motion.div>
           ))}
         </motion.div>
      </div>

      {/* Past/Completed Elections Divider */}
      {completedElections.length > 0 && (
        <div className="pt-12 border-t border-slate-200 dark:border-white/10 space-y-6 flex flex-col items-center">
           <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest text-center">Past Elections</h3>
           <div className="flex flex-wrap justify-center gap-4">
             {completedElections.map(el => (
               <Link 
                 key={el.election_id} 
                 to={`/voter/results?election=${el.election_id}`}
                 className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-full hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-white/5 transition-all shadow-sm"
               >
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{el.name}</span>
               </Link>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
