import "./input.css";

const Input = ({
  label,
  value,
  type,
  name,
  placeholder,
  required,
  icon,
  onChangeHandler,
  className,
  autofocus = false,
  error = false,
  showLabel = false,
  helperText,
  ...otherProps
}) => {
  const classes = `form-group ${className || ""}`;
  return (
    <div className={classes}>
      {showLabel && <label htmlFor={name}>{label}</label>}
      <div
        className={`input-group ${error ? "error" : ""} ${
          icon ? "" : "no-icon"
        }`}
      >
        {icon && (
          <span className="input-group-text bg-white" htmlFor={name}>
            {icon}
          </span>
        )}
        <input
          onChange={onChangeHandler}
          type={type || "text"}
          name={name}
          id={name}
          autoFocus={autofocus}
          value={value}
          className="form-control"
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby={name}
          autoComplete="false"
          required={required || false}
          {...otherProps}
        />
      </div>
      {helperText && (
        <p className={`${error ? "error helper-text" : ""}`}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
