import React from 'react';
import {Portal} from 'react-native-portalize';

import Line from '../../../assets/svgs/svgComponents/Line';
import {
  ButtonText,
  Container,
  Content,
  IconContainer,
  ModalContainer,
  Overlay,
  StyledButton,
  Title,
} from './styled';

interface Button {
  label: string;
  type: 'dangerous' | 'primary' | 'secondary';
  onPress: () => void;
}
interface CustomModalProps {
  name: string;
  buttons: Button[];
  icon: React.ReactNode;
  description: string;
  visible: boolean;
  // onClose: () => void;
  color?: string;
}
const Modal: React.FC<CustomModalProps> = ({name, buttons, icon, description, visible, color}) => {
  if (!visible) return null;
  return (
    <Portal>
      <Overlay>
        <ModalContainer>
          <Container>
            <Line />
            <IconContainer>{icon}</IconContainer>
            <Title>{name}</Title>
            <Content>{description}</Content>
          </Container>
          <Container>
            {buttons.map((button, index) => (
              <StyledButton key={index} type={button.type} onPress={button.onPress}>
                <ButtonText type={button.type}>{button.label}</ButtonText>
              </StyledButton>
            ))}
          </Container>
        </ModalContainer>
      </Overlay>
    </Portal>
  );
};

export default Modal;
