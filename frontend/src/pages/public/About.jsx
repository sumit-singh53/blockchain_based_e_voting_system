import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Code2, Network, Lock, Layers } from "lucide-react";
import Footer from "../../components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-[120px] transition-colors" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-300/30 dark:bg-sky-600/10 blur-[120px] transition-colors" />
      </div>

      <main className="flex-1 flex flex-col relative z-10 px-4 pt-24 pb-32 max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Democratizing Trust Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-500 dark:to-indigo-500">Cryptography</span>
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
            This project is a technical showcase demonstrating how distributed ledger technology 
            can solve the fundamental challenges of modern digital democracy: verifiability, 
            anonymity, and absolute immutability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md"
          >
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 rounded-xl flex items-center justify-center mb-6 border border-sky-200 dark:border-sky-500/30">
              <Network className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">The Architecture</h2>
            <p className="text-slate-700 dark:text-slate-400 leading-relaxed mb-4 font-medium">
              We built a custom, Python-based blockchain engine from scratch. It doesn't rely on existing networks like Ethereum; instead, it implements the core primitives of distributed systems directly to showcase a deep understanding of the underlying mechanics.
            </p>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span><strong>SECP256k1 ECDSA Signatures</strong> for identity verification</span>
              </li>
              <li className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <span><strong>SHA-256 Proof of Work (PoW)</strong> for consensus</span>
              </li>
              <li className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <span><strong>In-Memory Mempool</strong> for transaction queuing</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-md"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/30">
              <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">The Tech Stack</h2>
            <p className="text-slate-700 dark:text-slate-400 leading-relaxed mb-6 font-medium">
              The platform is separated into distinct micro-architectures to ensure modularity, scalability, and security.
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <h3 className="font-medium text-sky-600 dark:text-sky-300 mb-1">Frontend Layer</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">React, Vite, TailwindCSS, Framer Motion</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <h3 className="font-medium text-emerald-600 dark:text-emerald-300 mb-1">Backend REST API</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">FastAPI, Uvicorn, Python 3.11, Pydantic</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <h3 className="font-medium text-violet-600 dark:text-violet-300 mb-1">Data & Consensus Layer</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Custom Chain Engine, SQLite, ECDSA Cryptography</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link 
            to="/how-it-works" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(2,132,199,0.4)] hover:shadow-[0_0_30px_rgba(2,132,199,0.6)]"
          >
            See How Voting Works
            <Lock className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>

      <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/50 backdrop-blur-lg relative z-20">
         <Footer />
      </div>
    </div>
  );
};

export default About;
