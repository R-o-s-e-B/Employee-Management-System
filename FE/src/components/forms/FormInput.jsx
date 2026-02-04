const FormInput = ({ name, placeholder, value, onChange, type, options }) => {
  if (type === "dropdown") {
    return (
      <select
        style={{ color: "black", backgroundColor: "white" }}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (type == "date") {
    return (
      <input
        type="date"
        key={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    );
  }
  return (
    <input
      type="text"
      placeholder={placeholder}
      key={name}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormInput;
