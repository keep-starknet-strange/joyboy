import React from 'react';
import {Portal} from 'react-native-portalize';

import {LineIcon} from '../../assets/icons';
import {Button} from '../button';
import {
  ButtonText,
  Container,
  Content,
  getButtonColor,
  IconContainer,
  ModalContainer,
  Overlay,
  Title,
} from './styled';

interface CustomModalProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  visible: boolean;
  buttons: {label: string; type: 'primary' | 'secondary' | 'dangerous'; onPress: () => void}[];
}

const Modal: React.FC<CustomModalProps> = ({name, icon, description, visible, buttons}) => {
  if (!visible) return null;

  return (
    <Portal>
      <Overlay>
        <ModalContainer>
          <Container>
            <LineIcon color="#3C3C43" />
            <IconContainer>{icon}</IconContainer>
            <Title>{name}</Title>
            <Content>{description}</Content>
          </Container>
          <Container>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onPress={button.onPress}
                style={{backgroundColor: getButtonColor(button.type)}}
              >
                <ButtonText type={button.type}>{button.label}</ButtonText>
              </Button>
            ))}
          </Container>
        </ModalContainer>
      </Overlay>
    </Portal>
  );
};

export default Modal;
