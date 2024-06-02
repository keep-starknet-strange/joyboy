import React, {useState} from 'react';
import {Button, Pressable, View} from 'react-native';

import {ExitIcon, JoyboyIcon, NotificationIcon, Update, Warning} from '../../assets/icons';
import {Divider} from '../../components';
import Modal from '../../components/modal';
import {Container} from './styled';

export const DialogPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = (modalType: string | null) => {
    setActiveModal(modalType);
  };

  return (
    <View>
      <Container>
        <Pressable>
          <JoyboyIcon color="#14142C" width={96} height={16} />
        </Pressable>

        <Pressable>
          <NotificationIcon width={20} height={20} />
        </Pressable>
      </Container>

      <View style={{marginBottom: 1}}>
        <Divider />
      </View>
      <Button title="Show Modal" onPress={() => setModalVisible(true)} />

      <Modal
        name="Example Modal"
        icon={<Warning />}
        description="This is an example modal."
        visible={modalVisible}
        buttonTypes={['primary', 'secondary']} 
      />
    </View>
  );
};
