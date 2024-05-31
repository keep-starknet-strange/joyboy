import React from 'react'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-portalize'
import Line from '../../../assets/svgs/svgComponents/Line';


interface CustomModalProps {
    name: string;
    buttonText: string;
    icon: React.ReactNode;
    text: string;
    visible: boolean;
    onClose: () => void;
  }
const Modal: React.FC<CustomModalProps>  = ({ name, buttonText, icon, text, visible, onClose }) => {

    if (!visible) return null;
  return (
    <Portal>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Line/>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.content}>{text}</Text>
        <Button title={buttonText} onPress={onClose} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Portal>
  )
}


const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modal: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
    },
    iconContainer: {
      marginBottom: 10,
    },
    content: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#ccc',
      borderRadius: 5,
    },
    closeButtonText: {
      fontSize: 16,
    },
  });
  
export default Modal