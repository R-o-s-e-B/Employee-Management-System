const FormInput = ({ name, placeholder, value, onChange, type, options }) => {
  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };

  if (type === "dropdown") {
    return (
      <select
        style={{
          ...inputStyle,
          color: "#333",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
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
        style={inputStyle}
      />
    );
  }

  if (type == "number") {
    return (
      <input
        type="number"
        placeholder={placeholder}
        key={name}
        name={name}
        value={value}
        onChange={onChange}
        step="0.01"
        style={inputStyle}
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
      style={inputStyle}
    />
  );
};

export default FormInput;
