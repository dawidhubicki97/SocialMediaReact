import React, { useState } from "react";
import "./Profile.css";

export default function ReadMore({ children }) {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text">
      {isReadMore ? text.slice(0, 50) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? " ...czytaj wiecej" : " ukryj"}
      </span>
    </p>
  );
}
