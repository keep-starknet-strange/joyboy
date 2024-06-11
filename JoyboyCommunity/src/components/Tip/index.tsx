import {forwardRef, useMemo, useState} from 'react';
import {Platform, View, Image} from 'react-native';
import {Modalize as RNModalize, ModalizeProps as RNModalizeProps} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import {useStyles} from '../../hooks';
import {Divider} from '../Divider';
import {Text} from '../Text';
import stylesheet from './styles';
import {BackIcon, CancelIcon, LikeFillIcon} from '../../assets/icons';
import {Button} from '../Button';
import {Spacing} from '../../styles';
import {Input} from '../Input';

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
            weight="regular"
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
          <View
            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
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

            <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
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
                {label: 'Strk', value: 'Strk'},
                {label: 'Eth', value: 'Eth'},
              ]}
            />
          </View>
          <Input value={amount} onChangeText={setAmount} placeholder="Amount" />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text color="#6B6B8C" fontSize={16} weight="medium">
            Sending...
          </Text>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center', paddingBottom: 10}}>
            <Text fontSize={16} weight="regular">
              to
            </Text>
            <Text fontSize={16} weight="medium">
              @zenkai
            </Text>
          </View>
        </View>

        <Button variant={isActive ? 'secondary': 'default'} >Tip</Button>

        <Text style={{paddingTop: Spacing.small}} fontSize={13} weight="regular" color="#A1A1C7">
          Tip friends and support creators with your favorite tokens.
        </Text>
      </SafeAreaView>
    </RNModalize>
  );
});
