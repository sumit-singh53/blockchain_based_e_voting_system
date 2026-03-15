const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-[#0B0F19] text-slate-200 dark:text-slate-300 py-12 mt-auto border-t border-transparent dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-3">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
             <span className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <span className="w-4 h-4 bg-sky-500 rounded-md shadow-lg shadow-sky-500/50" />
             </span>
             Blockchain e-Voting
          </h4>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-sm">
            Secure, transparent, and verifiable elections powered by cryptographic identity and distributed ledger technology.
          </p>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">Resources</h5>
          <ul className="mt-4 space-y-3 text-sm font-medium text-slate-400">
            <li className="hover:text-sky-400 cursor-pointer transition-colors">Documentation</li>
            <li className="hover:text-sky-400 cursor-pointer transition-colors">API Reference</li>
            <li className="hover:text-sky-400 cursor-pointer transition-colors">Support Portal</li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact</h5>
          <p className="mt-4 text-sm font-medium text-slate-400 hover:text-sky-400 cursor-pointer transition-colors">hello@evoting.example.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 dark:border-white/5">
        <p className="text-center text-xs font-medium text-slate-500">
          © {new Date().getFullYear()} National eVoting Infrastructure. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
