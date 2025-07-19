import React, { useState } from "react";
import { Star } from "lucide-react";
import styles from "./Rating.module.css";

type RatingProps = {
  rating: number;
  setRating: (r: number) => void;
};

const Rating: React.FC<RatingProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);

  return (
    <div className={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((r) => (
        <Star
          key={r}
          size={20}
          color={r <= (hoverRating ?? rating) ? "#ffffff" : "#d1d5db"}
          fill={r <= (hoverRating ?? rating) ? "#ffffff" : "none"}
          strokeWidth={1.5}
          className={styles.starIcon}
          onClick={() => setRating(r)} 
          onMouseEnter={() => setHoverRating(r)}
          onMouseLeave={() => setHoverRating(undefined)}
          style={{ cursor: "pointer" }}
        />
      ))}
      <span className={styles.ratingText}>
        {rating ? `${rating} out of 5` : "No rating"}
      </span>
    </div>
  );
};

export default Rating;
