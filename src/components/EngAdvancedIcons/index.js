import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import {Row} from 'antd';
import EngIcon from '../EngIcon';
import './index.scss';
import { Label } from '../Label';

/**
 * It displays two EngIcon on mouseEnter
 */
const EngAdvancedIcon = (props) => {
  const {
    type,
    background,
    actionNodes = [],
    label,
    dragRef,
    id,
    ...rest
  } = props;

  // Set visibility on mouse enter event and vice-versa
  const [actionIconsVisible, setActionIconsVisibility] = useState(false);

  const getActionIcons = (actionNodes) =>
    actionNodes?.map((node) => {
      const { type, background, position } = node;
      return (
        <EngIcon
          type={type}
          key={type}
          style={{ background }}
          className={classnames(
            `${position}-action-icon-container`,
            'action-icon-container',
            'advanced-icon-child'
          )}
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
      <Row className='advanced-icon-container'>
        <div
          onMouseEnter={actionNodes?.length ? showActionIcons : undefined}
          onMouseLeave={actionNodes?.length ? hideActionIcons : undefined}
          ref={dragRef}
        >
          <EngIcon
            type={type}
            className='advanced-icon-parent'
            background={background}
            {...rest}
          />
          {actionIconsVisible && getActionIcons(actionNodes)}
        </div>
      </Row>
      <Label className='advanced-icon-text'>{label}</Label>
    </>
  );
};

  export default EngAdvancedIcon;
