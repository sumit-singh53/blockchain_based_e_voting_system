import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../../components/layout/Footer";
import { ShieldCheck, Database, Layers } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-300/30 dark:bg-sky-600/20 blur-[120px] transition-colors" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 dark:bg-indigo-600/20 blur-[120px] transition-colors" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20 pb-32">
        <div className="max-w-6xl w-full mx-auto text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none"
          >
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-300">Military-Grade Election Integrity</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight max-w-4xl mx-auto"
          >
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500">Democratic</span> Infrastructure
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Immutable, cryptographically verified, and fully transparent. We are modernizing elections using decentralized consensus protocols.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              to="/register" 
              className="px-8 py-4 bg-sky-600 text-white hover:bg-sky-700 dark:bg-white dark:text-slate-900 rounded-full font-bold dark:hover:bg-slate-200 transition-colors w-full sm:w-auto text-center relative overflow-hidden group shadow-lg"
            >
               Get Started
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link 
              to="/how-it-works" 
              className="px-8 py-4 bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full font-bold transition-colors w-full sm:w-auto text-center backdrop-blur-sm shadow-sm"
            >
              Examine the Chain
            </Link>
          </motion.div>

          {/* Value Props Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 max-w-5xl mx-auto text-left"
          >
             <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                <Database className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Tamper-Proof Ledger</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed font-medium">Every vote is cryptographically signed and permanently etched into an immutable ledger guaranteeing complete election integrity.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Absolute Privacy</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed font-medium">Advanced cryptographic primitive breaks the link between voter identities and the payloads cast on the blockchain network.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Mathematical Audit</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed font-medium">The entire election state is transparently available for anyone to mathematically verify down to the individual block hashes.</p>
             </div>
          </motion.div>

        </div>
      </main>
      
      <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/50 backdrop-blur-lg relative z-20">
         <Footer />
      </div>
    </div>
  );
};

export default Home;
