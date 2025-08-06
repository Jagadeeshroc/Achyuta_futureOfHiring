const FormInput = ({ icon, type, name, placeholder, value, onChange, required }) => {
  return (
    <div className="flex items-center gap-3 border border-white/30 bg-white/5 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary-400">
      {icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent outline-none text-white placeholder-white/60 flex-1"
      />
    </div>
  );
};

export default FormInput;
