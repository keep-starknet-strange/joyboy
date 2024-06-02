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

type ButtonType = 'primary' | 'secondary' | 'dangerous';

const buttons: Array<{type: ButtonType; label: string; onPress: () => void}> = [
  {type: 'primary', label: 'Primary', onPress: () => console.log('Primary')},
  {type: 'secondary', label: 'Secondary', onPress: () => console.log('Secondary')},
  {type: 'dangerous', label: 'Dangerous', onPress: () => console.log('Dangerous')},
];

interface CustomModalProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  visible: boolean;
  buttonTypes: ButtonType[];
}

const Modal: React.FC<CustomModalProps> = ({name, icon, description, visible, buttonTypes}) => {
  if (!visible) return null;

  const filteredButtons = buttons.filter((button) => buttonTypes.includes(button.type));

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
            {filteredButtons.map((button, index) => (
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
