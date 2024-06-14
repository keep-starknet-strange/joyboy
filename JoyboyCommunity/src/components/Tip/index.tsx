import {forwardRef, useMemo, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import {Modalize as RNModalize} from 'react-native-modalize';
import RNPickerSelect from 'react-native-picker-select';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BackIcon, CancelIcon, LikeFillIcon} from '../../assets/icons';
import {useStyles} from '../../hooks';
import {Spacing} from '../../styles';
import {Button} from '../Button';
import {Divider} from '../Divider';
import {Input} from '../Input';
import {Text} from '../Text';
import stylesheet from './styles';

export const TipToken = forwardRef((props, ref) => {
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
    <RNModalize
      ref={ref}
      handlePosition={Platform.OS === 'ios' ? 'inside' : 'outside'}
      adjustToContentHeight
      modalStyle={styles.modal}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <View style={styles.header}>
          <BackIcon />

          <Text
            weight="medium"
            color="textSecondary"
            align="center"
            fontSize={18}
            style={styles.title}
          >
            Tip
          </Text>

          <CancelIcon />
        </View>
        <Divider />

        <View style={styles.post}>
          <View style={styles.postHeader}>
            <View style={styles.innerPostHeader}>
              <Image source={require('../../assets/post.png')} />
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
            <RNPickerSelect
              pickerProps={{style: styles.pickerSelect}}
              onValueChange={(value) => setToken(value)}
              value={token}
              items={[
                {label: 'JYB', value: 'JYB'},
                {label: 'STRK', value: 'STRK'},
              ]}
            />
          </View>
          <Input value={amount} onChangeText={setAmount} placeholder="Amount" />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text color="#6B6B8C" fontSize={16} weight="medium">
            Sending
            {amount.length > 0 && token.length > 0 ? (
              <Text style={{paddingLeft: 10}} color="#EC796B" fontSize={16} weight="bold">
                {amount} {token}
              </Text>
            ) : (
              <Text style={{paddingLeft: 10}} color="#EC796B" fontSize={16} weight="bold">
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

        <View style={{paddingTop: 40}}>
          <Button variant={isActive ? 'secondary' : 'default'}>Tip</Button>
        </View>

        <Text style={{paddingTop: Spacing.small}} fontSize={13} weight="regular" color="#A1A1C7">
          Tip friends and support creators with your favorite tokens.
        </Text>
      </SafeAreaView>
    </RNModalize>
  );
});
TipToken.displayName = 'TipToken';
