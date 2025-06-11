const Checkbox = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary-2 focus:ring-primary-2 border-gray-300 rounded"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;