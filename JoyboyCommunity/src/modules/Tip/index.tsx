import {forwardRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Avatar, Button, Input, Modalize, Picker, Text} from '../../components';
import {useStyles} from '../../hooks';
import stylesheet from './styles';

export const TipToken = forwardRef<RNModalize>((props, ref) => {
  const styles = useStyles(stylesheet);
  const [token, setToken] = useState<string>('JBY');
  const [amount, setAmount] = useState<string>('');

  const isActive = !!amount && !!token;

  return (
    <Modalize
      handlePosition={Platform.OS === 'ios' ? 'inside' : 'outside'}
      adjustToContentHeight
      title="Tip"
      ref={ref}
      modalStyle={styles.modal}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardContent}>
              <Avatar size={48} source={require('../../assets/joyboy-logo.png')} />

              <View>
                <Text fontSize={15} color="text" weight="bold">
                  Abdel 全快 Zenkai 🐉🐺
                </Text>
                <Text fontSize={11} color="textLight" weight="regular">
                  @zenkai
                </Text>
              </View>
            </View>

            <View style={styles.likes}>
              <Text fontSize={11}>16 likes</Text>
            </View>
          </View>

          <Text fontSize={13} weight="medium" color="text" style={styles.cardContentText}>
            Live at Miami Stark Conf 2.0...
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <View>
            <Picker
              label="Please select a token"
              selectedValue={token}
              onValueChange={(itemValue) => setToken(itemValue)}
            >
              <Picker.Item label="JYB" value="JYB" />
              <Picker.Item label="STRK" value="STRK" />
            </Picker>
          </View>

          <Input value={amount} onChangeText={setAmount} placeholder="Amount" />
        </View>

        <View style={styles.sending}>
          <View style={styles.sendingText}>
            <Text color="textSecondary" fontSize={16} weight="medium">
              Sending
            </Text>

            {amount.length > 0 && token.length > 0 ? (
              <Text color="primary" fontSize={16} weight="bold">
                {amount} {token}
              </Text>
            ) : (
              <Text color="primary" fontSize={16} weight="bold">
                ...
              </Text>
            )}
          </View>

          <View style={styles.recipient}>
            <Text fontSize={16} weight="regular">
              to
            </Text>
            <Text fontSize={16} weight="medium">
              @zenkai
            </Text>
          </View>
        </View>

        <View style={styles.submitButton}>
          <Button variant="secondary" disabled={!isActive}>
            Tip
          </Button>
        </View>

        <Text
          weight="semiBold"
          color="inputPlaceholder"
          fontSize={13}
          align="center"
          style={styles.comment}
        >
          Tip friends and support creators with your favorite tokens.
        </Text>
      </SafeAreaView>
    </Modalize>
  );
});
TipToken.displayName = 'TipToken';
