const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
        <div>
          <h4 className="text-lg font-semibold">Blockchain e-Voting</h4>
          <p className="text-sm text-slate-400 mt-2">
            Secure, transparent, and verifiable elections powered by blockchain technology.
          </p>
        </div>
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide">Resources</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Documentation</li>
            <li>API Reference</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide">Contact</h5>
          <p className="mt-3 text-sm text-slate-400">hello@evoting.example.com</p>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 mt-8">© {new Date().getFullYear()} Blockchain e-Voting. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
