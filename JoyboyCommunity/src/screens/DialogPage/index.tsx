import React, {useState} from 'react';
import {Button, Pressable, View} from 'react-native';

import Exit from '../../../assets/svgs/svgComponents/Exit';
import Update from '../../../assets/svgs/svgComponents/Update';
import Warning from '../../../assets/svgs/svgComponents/Warning';
import {NotificationIcon} from '../../assets/icons';
import {Divider} from '../../components';
import Modal from '../../components/modal';
import {Container, Logo} from './styled';

export const DialogPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const toggleModal = (modalType: string | null) => {
    setActiveModal(modalType);
  };

  return (
    <View>
      <Container>
        <Pressable>
          <Logo source={require('../../../assets/Logo.png')} />
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
          color="#EC796B"
        />
      )}

      {activeModal === 'logout' && (
        <Modal
          name="Leaving so soon?"
          buttons={[
            {label: 'Logout', type: 'primary', onPress: () => toggleModal(null)},
            {label: 'Cancel', type: 'secondary', onPress: () => toggleModal(null)},
          ]}
          icon={<Exit />}
          description="Are you sure you want to logout?"
          visible={true}
          color="#EC796B"
        />
      )}

      {activeModal === 'update' && (
        <Modal
          name="Update profile"
          buttons={[
            {label: 'Save', type: 'dangerous', onPress: () => toggleModal(null)},
            {label: 'Cancel', type: 'secondary', onPress: () => toggleModal(null)},
          ]}
          icon={<Update />}
          description="Would you like to save this update to your profile."
          visible={true}
          color="#0C0C4F"
        />
      )}
    </View>
  );
};
