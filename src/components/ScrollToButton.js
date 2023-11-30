import React from 'react';

const ScrollToButton = ({ onClickHandler }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      <button onClick={scrollToTop}>Scroll to Top</button>
    </div>
  );
};

export default ScrollToButton;
