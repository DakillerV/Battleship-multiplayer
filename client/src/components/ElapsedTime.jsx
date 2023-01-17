import React, { useState, useEffect } from "react";
const ElapsedTime = (props) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { startingTime } = props;
  const CalculateTime = (date) => {
    const date1 = date;
    const date2 = new Date();
    return Math.ceil(Math.abs(date2 - date1) / 1000);
  };

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
        const newElapsedTime = CalculateTime(startingTime)
        setTimeElapsed(newElapsedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeElapsed]);
  return (
    <>
      <div>Elapsed Time: {timeElapsed}s</div>
    </>
  );
};

export default ElapsedTime;
