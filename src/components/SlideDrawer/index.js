import React from 'react';
import './SlideDrawer.scss';
import ConfigurationIllustration from '../../assets/configure.svg'
import {Label} from '../Label';
const SlideDrawer = (props) => {
  let drawerClasses = 'side-drawer';
  if (props.show) {
    drawerClasses = 'side-drawer open';
  }
  /**You can use your custom component here to configure block data */
  return (
    <div className={drawerClasses}>
      <Label fontSize="18px" fontWeight="500" margin="8px">{props.content}</Label>

      <div className="illustration-container">
        <img className="illustration" src={ConfigurationIllustration} alt="ConfigurationIllustration"/>
      </div>
    </div>
  );
};
export default SlideDrawer;
