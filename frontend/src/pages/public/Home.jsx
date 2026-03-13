import Footer from "../../components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-sm uppercase tracking-widest text-sky-600 font-semibold">Secure. Transparent. Trusted.</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">
            Blockchain-powered electronic voting built for national scale.
          </h1>
          <p className="text-lg text-slate-600 mt-6 max-w-3xl">
            Combine biometric-grade identity verification with tamper-proof blockchain audit trails to deliver elections the public can trust.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
