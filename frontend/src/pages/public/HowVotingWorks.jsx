import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Fingerprint, FileSignature, DatabaseZap, Pickaxe, CheckCircle2 } from "lucide-react";
import Footer from "../../components/layout/Footer";

const HowVotingWorks = () => {
  const steps = [
    {
      icon: <Fingerprint className="w-6 h-6 text-sky-400" />,
      title: "1. Voter Identity Verification",
      description: "Users authenticate via traditional credentials (email/password). The backend verifies identity and issues a short-lived cryptographic JSON Web Token (JWT) ensuring only authorized voters enter the portal.",
      color: "border-sky-500/30 bg-sky-500/10"
    },
    {
      icon: <FileSignature className="w-6 h-6 text-indigo-400" />,
      title: "2. Cryptographic Signing",
      description: "When a voter casts a ballot, a unique SECP256k1 Wallet is generated. The vote payload is hashed and signed using Elliptic Curve Digital Signature Algorithm (ECDSA). This guarantees the vote's origin without exposing personal data.",
      color: "border-indigo-500/30 bg-indigo-500/10"
    },
    {
      icon: <DatabaseZap className="w-6 h-6 text-violet-400" />,
      title: "3. Mempool Queuing",
      description: "The signed transaction is broadcasted to the backend and placed in the Mempool—a waiting area for unconfirmed transactions. The system instantly verifies the signature's mathematical validity before accepting it.",
      color: "border-violet-500/30 bg-violet-500/10"
    },
    {
      icon: <Pickaxe className="w-6 h-6 text-emerald-400" />,
      title: "4. Proof-of-Work Mining",
      description: "Administrators trigger the mining process. The system takes all pending transactions, bundles them into a Block, and performs SHA-256 Proof of Work to find a hash with a specific difficulty (leading zeros).",
      color: "border-emerald-500/30 bg-emerald-500/10"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-amber-400" />,
      title: "5. Immutable Confirmation",
      description: "The successfully mined block is firmly attached to the chain, cryptographically linked to the previous block. The votes are now immutable. Any tampering would invalidate the entire downstream chain.",
      color: "border-amber-500/30 bg-amber-500/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-900/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[150px]" />
      </div>

      <main className="flex-1 flex flex-col relative z-10 px-4 pt-24 pb-32 max-w-5xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Anatomy of a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-500">Blockchain Vote</span>
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
            Follow the journey of a single vote—from a user's browser, through cryptographic signing, into the mempool, and finally etched into eternity on the ledger.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6 relative"
        >
           {/* Connecting Line */}
           <div className="absolute left-[27px] md:left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-sky-500/50 via-violet-500/50 to-amber-500/50 hidden sm:block" />

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="relative flex items-start gap-4 md:gap-8"
            >
               <div className={`shrink-0 z-10 w-14 h-14 md:w-20 md:h-20 rounded-2xl border ${step.color} backdrop-blur-md flex items-center justify-center shadow-lg mt-1 sm:mt-0`}>
                  {step.icon}
               </div>
               <div className="flex-1 p-6 md:p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium">{step.description}</p>
               </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-20"
        >
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-full font-bold transition-all hover:scale-105 shadow-xl"
          >
            Become a Verified Voter
          </Link>
        </motion.div>
      </main>

      <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/50 backdrop-blur-lg relative z-20">
         <Footer />
      </div>
    </div>
  );
};

export default HowVotingWorks;
