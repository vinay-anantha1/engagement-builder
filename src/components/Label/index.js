import styled from 'styled-components';

export const Label = styled.div`
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  color: ${(props) => props.color || '#091E42'};
  line-height: ${(props) => props.lineHeight || 'normal'};
`;
export const LabelInline = styled.span`
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  color: ${(props) => props.color || '#091E42'};
  line-height: ${(props) => props.lineHeight || 'normal'};
`;
