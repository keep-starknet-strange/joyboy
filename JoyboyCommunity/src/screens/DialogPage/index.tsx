import React, {useState} from 'react';
import {Button, Pressable, View} from 'react-native';

import {ExitIcon, JoyboyIcon, NotificationIcon, Update, Warning} from '../../assets/icons';
import {Divider} from '../../components';
import Modal from '../../components/modal';
import {Container} from './styled';

export const DialogPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
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

      <View style={{gap: 8}}>
        <Button title="Open Main Modal" onPress={() => toggleModal('delete')} />
        <Button title="Open Logout Modal" onPress={() => toggleModal('logout')} />
        <Button title="Open Update Modal" onPress={() => toggleModal('update')} />
      </View>
      {activeModal === 'delete' && (
        <Modal
          name="Delete account?"
          // buttons={[
          //   { label: 'Confirm', type: 'primary', onPress: closeModal },
          //   { label: 'Cancel', type: 'secondary', onPress: closeModal },
          // ]}
          buttons={[
            {label: 'Delete', type: 'primary', onPress: () => toggleModal(null)},
            {label: 'Close', type: 'secondary', onPress: () => toggleModal(null)},
          ]}
          icon={<Warning />}
          description="If you delete your account, you will not be 
            able to log in again. Would you like to continue?"
          visible={true}
        />
      )}

      {activeModal === 'logout' && (
        <Modal
          name="Leaving so soon?"
          buttons={[
            {label: 'Logout', type: 'primary', onPress: () => toggleModal(null)},
            {label: 'Cancel', type: 'secondary', onPress: () => toggleModal(null)},
          ]}
          icon={<ExitIcon color="#EC796B" />}
          description="Are you sure you want to logout?"
          visible={true}
        />
      )}

      {activeModal === 'update' && (
        <Modal
          name="Update profile"
          buttons={[
            {label: 'Save', type: 'dangerous', onPress: () => toggleModal(null)},
            {label: 'Cancel', type: 'secondary', onPress: () => toggleModal(null)},
          ]}
          icon={<Update color="#0C0C4F" />}
          description="Would you like to save this update to your profile."
          visible={true}
        />
      )}
    </View>
  );
};
