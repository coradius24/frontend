const HeroBanner = ({ className = "", children }) => {
  return (
    <>
      <section className={`${className} rainbow-banner`}>
        <div className="ellipse-top-corner"></div>
        <div className="ellipse-right"></div>
        <div className="container">
          <div className="ellipse-top"></div>
          <div className="ellipse-top-right"></div>
          {children}
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
