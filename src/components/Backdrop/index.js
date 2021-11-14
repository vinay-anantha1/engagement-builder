import React from 'react';
import './Backdrop.scss';
const Backdrop = (props) => {
  return <div className='backdrop' onClick={props.closeSlider} />;
};
export default Backdrop;
