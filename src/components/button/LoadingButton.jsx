const LoadingButton = ({ className }) => {
  return (
    <button className={`btn ${className}`} type="button" disabled>
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      লোডিং....
    </button>
  );
};

export default LoadingButton;
