import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import {Row} from 'antd';
import EngIcon from '../EngIcon';
import './index.scss';

/**
 * It displays two EngIcon on mouseEnter
 */
const EngAdvancedIcon = (props) => {
    const {
      type,
      actionNodes = [],
      background,
      ...rest
    } = props;

    // Set visibility on mouse enter event and vice-versa
    const [actionIconsVisible, setActionIconsVisibility] = useState(false);
 
    const getActionIcons = (actionNodes) => actionNodes?.map((node) => {
        const { type, background, position } = node;
        return (
          <EngIcon
            type={type}
            key={type}
            style={{ background }}
            className={classnames(`${position}-action-icon-container`, 'action-icon-container', 'advanced-icon-child')}
          />
        );
      });
  
    const showActionIcons = useCallback(() => {
      setActionIconsVisibility(true);
    }, []);
  
    const hideActionIcons = useCallback(() => {
      setActionIconsVisibility(false);
    }, []);
  
    return (
      <>
        <Row className="advanced-icon-container">
          <div
            onMouseEnter={actionNodes?.length ? showActionIcons : undefined}
            onMouseLeave={actionNodes?.length ? hideActionIcons : undefined}
          >
            <EngIcon
              type={type}
              className="advanced-icon-parent"
              background={background}
              {...rest}
            />
            {actionIconsVisible && getActionIcons(actionNodes)}
          </div>
        </Row>
      </>
    );
  };

  export default EngAdvancedIcon;
