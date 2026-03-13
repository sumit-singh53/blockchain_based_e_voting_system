export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

export const shortHash = (hash = "") => `${hash.slice(0, 6)}...${hash.slice(-6)}`;
