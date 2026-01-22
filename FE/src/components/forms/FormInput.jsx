const FormInput = ({ name, placeholder, value, onChange, type, options }) => {
  if (type === "dropdown") {
    return (
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type="text"
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormInput;
