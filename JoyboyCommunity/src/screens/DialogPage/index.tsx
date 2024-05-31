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
  const [isModalVisible, setModalVisible] = useState(false);
  const [logOut, setisLogoutModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openLogoutModal = () => {
    setisLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setisLogoutModal(false);
  };

  const openUpdateModal = () => {
    setUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setUpdateModal(false);
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
        <Button title="Open delete Modal" onPress={openModal} />
        <Button title="Open Log out Modal" onPress={openLogoutModal} />
        <Button title="Open update Modal" onPress={openUpdateModal} />
      </View>

      <Modal
        name="Delete account?"
        buttonText1="Delete"
        buttonText2="No, thanks"
        icon={<Warning />}
        description="If you delete your account, you will not be 
          able to log in again. Would you like to continue?"
        visible={isModalVisible}
        onClose={closeModal}
        color="#EC796B"
      />

      <Modal
        name="Leaving so soon?"
        buttonText1="Logout"
        buttonText2="Cancel"
        icon={<Exit />}
        description="Are you sure you want to logout?"
        visible={logOut}
        onClose={closeLogoutModal}
        color="#EC796B"
      />

      <Modal
        name="Update profile"
        buttonText1="Save"
        buttonText2="Cancel"
        icon={<Update />}
        description="Would you like to save this update to your profile."
        visible={updateModal}
        onClose={closeUpdateModal}
        color="#0C0C4F"
      />
    </View>
  );
};
