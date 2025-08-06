const GlassCard = ({ children }) => {
  return (
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
};

export default GlassCard;
