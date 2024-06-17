import {Picker} from '@react-native-picker/picker';
import {forwardRef, useMemo, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';

import {LikeFillIcon} from '../../assets/icons';
import {Button, Input, Modalize} from '../../components';
import {Text} from '../../components/Text';
import {useStyles} from '../../hooks';
import {Spacing} from '../../styles';
import stylesheet from './styles';

export const TipToken = forwardRef<RNModalize>((props, ref) => {
  const styles = useStyles(stylesheet);
  const [token, setToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const isActive = useMemo(() => {
    if (amount.length > 0 && token.length > 0) {
      return true;
    }
    return false;
  }, [amount, token]);

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
              <Image
                style={{width: 48, height: 48}}
                source={require('../../assets/joyboy-logo.png')}
              />
              <View>
                <Text fontSize={15} color="text" weight="bold">
                  Abdel 全快 Zenkai 🐉🐺
                </Text>
                <Text fontSize={11} color="#8F979E" weight="regular">
                  @zenkai
                </Text>
              </View>
            </View>

            <View style={styles.likes}>
              <LikeFillIcon color="#EC796B" />
              <Text fontSize={11}>16 likes</Text>
            </View>
          </View>

          <Text fontSize={13} weight="medium" color="#14142C" style={{paddingTop: Spacing.small}}>
            Live at Miami Stark Conf 2.0...
          </Text>
        </View>

        <View style={{paddingTop: 40, paddingBottom: 40}}>
          <View style={{marginBottom: 20}}>
            <Picker
              style={styles.pickerSelect}
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
          <Text color="#6B6B8C" fontSize={16} weight="medium">
            Sending
            {amount.length > 0 && token.length > 0 ? (
              <Text style={styles.more} fontSize={16} weight="bold">
                {amount} {token}
              </Text>
            ) : (
              <Text style={styles.more} fontSize={16} weight="bold">
                ...
              </Text>
            )}
          </Text>

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
          <Button variant={isActive ? 'secondary' : 'default'}>Tip</Button>
        </View>

        <Text style={styles.comment}>
          Tip friends and support creators with your favorite tokens.
        </Text>
      </SafeAreaView>
    </Modalize>
  );
});
TipToken.displayName = 'TipToken';
