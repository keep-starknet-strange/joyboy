import {FlatList, RefreshControl, View} from 'react-native';

import {useRootNotes} from '../../hooks';
import {Post} from '../../shared/components/Post';
import {RootStackProfileScreenProps} from '../../types';
import {ProfileInfo} from './Info';
import styles from './styles';

export const Profile: React.FC<RootStackProfileScreenProps> = ({route}) => {
  const {publicKey} = route.params ?? {};

  const notes = useRootNotes({authors: [publicKey]});

  console.log(notes.data);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={<ProfileInfo publicKey={publicKey} />}
        data={notes.data.pages.flat()}
        keyExtractor={(item) => item?.id}
        renderItem={({item}) => {
          return <Post event={item} />;
        }}
        refreshControl={
          <RefreshControl refreshing={notes.isFetching} onRefresh={() => notes.refetch()} />
        }
      />
    </View>
  );
};
