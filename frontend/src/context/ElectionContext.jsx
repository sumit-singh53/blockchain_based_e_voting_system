import { createContext, useContext, useState } from "react";

const ElectionContext = createContext({
  elections: [],
  activeElectionId: null,
  setActiveElectionId: () => {},
});

export const ElectionProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [activeElectionId, setActiveElectionId] = useState(null);

  const addElection = (election) => setElections((prev) => [...prev, election]);

  return (
    <ElectionContext.Provider value={{ elections, activeElectionId, setActiveElectionId, addElection }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElectionContext = () => useContext(ElectionContext);
