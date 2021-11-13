import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import EngIcon from '../../components/EngIcon';

const TriggerContainer = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 16px;
  border: 1px dashed #b3bac5;
  background-color: #fafbfc;
  text-align: center;
  padding: 16px 8px;

  .ant-btn.cap-button-v2 {
    padding-right: 10px;
    padding-left: 10px;
  }
`;

const Trigger = (props) => {
  const { width, height, className, showButton, buttonProps, triggerContent } =
    props;
  return (
    <TriggerContainer width={width} height={height} className={className}>
      {showButton && (
        <Button type={buttonProps.type}>
          <EngIcon type={buttonProps.iconType} />
          {buttonProps.title}
        </Button>
      )}
      {triggerContent}
    </TriggerContainer>
  );
};

Trigger.defaultProps = {
  showButton: true,
  buttonProps: {
    type: 'primary',
    title: 'Entry trigger',
    iconType: 'entry',
  },
  width: '148px',
  height: '180px',
  triggerContent: null,
};

export default Trigger;
