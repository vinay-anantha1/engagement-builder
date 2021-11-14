import React from 'react';
import './SlideDrawer.scss';
const SlideDrawer = (props) => {
  let drawerClasses = 'side-drawer';
  if (props.show) {
    drawerClasses = 'side-drawer open';
  }
  return (
    <div className={drawerClasses}>
      <h1>{props.content}</h1>
    </div>
  );
};
export default SlideDrawer;
