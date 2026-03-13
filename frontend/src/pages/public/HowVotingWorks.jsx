const HowVotingWorks = () => {
  const steps = [
    "Voter identity verification",
    "Ballot issuance",
    "Vote encryption and signing",
    "Blockchain broadcast",
    "Consensus and confirmation",
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-slate-900">How Blockchain Voting Works</h2>
      <ol className="mt-8 space-y-4 list-decimal list-inside text-slate-600">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
};

export default HowVotingWorks;
