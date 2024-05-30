import {ScrollView} from 'react-native';

interface Props {
  children: React.ReactNode;
  contentContainerStyle?: any;
}

export const ScrollableContainer = (props: Props) => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, ...props.contentContainerStyle}}>
      {props.children}
    </ScrollView>
  );
};
