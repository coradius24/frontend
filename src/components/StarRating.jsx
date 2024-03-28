const StarRating = ({ filledStars, fillFromStart = true }) => {
  const totalStars = 5; // You can customize the total number of stars

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      const isFilled = fillFromStart
        ? i < filledStars
        : i >= totalStars - filledStars;
      const starClassName = isFilled ? "fas fa-star filled" : "fas fa-star";
      stars.push(<i key={i} className={starClassName} />);
    }
    return stars;
  };

  return <span className="rating">{renderStars()}</span>;
};

export default StarRating;
