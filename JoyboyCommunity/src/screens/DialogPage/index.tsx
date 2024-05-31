import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, View } from 'react-native'
import { Container, Logo } from './styled'
import { NotificationIcon } from '../../assets/icons'
import { Divider } from '../../components'
import Modal from '../../components/modal';
import Warning from '../../../assets/svgs/svgComponents/Warning';


export const DialogPage: React.FC=()=> {
  const [isModalVisible, setModalVisible] = useState(false);


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <View>
<Container>
  <Pressable>
    <Logo source={require('../../../assets/Logo.png')}/>
  </Pressable>


  <Pressable>
    <NotificationIcon width={20} height={20}/>
  </Pressable>
</Container>


<View style={{marginBottom: 1}}>
        <Divider />
      </View>

      <Button title="Open Modal" onPress={openModal} />
        <Modal
          name="Custom Modal"
          buttonText="Close"
          icon={<Warning />} // Replace with your actual icon component
          text="This is the modal content"
          visible={isModalVisible}
          onClose={closeModal}
        />
    </View>
   
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});