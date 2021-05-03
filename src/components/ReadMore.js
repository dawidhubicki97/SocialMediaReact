import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function ReadMore({ children }) {
  const text = children;
  const [textLong, setTextLong] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  useEffect(() => {
    if (text.length > 50) setTextLong(true);

    console.log(textLong);
  }, []);

  return (
    <p className="text">
      {textLong ? (
        <>
          {isReadMore ? text.slice(0, 50) : text}
          <span onClick={toggleReadMore} className="read-or-hide">
            {isReadMore ? " ...czytaj wiecej" : " ukryj"}
          </span>
        </>
      ) : (
        <div>{text}</div>
      )}
    </p>
  );
}
