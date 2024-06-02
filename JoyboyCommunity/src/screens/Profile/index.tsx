import {FlatList, RefreshControl, View} from 'react-native';

import {useRootNotes, useStyles} from '../../hooks';
import {Post} from '../../modules/Post';
import {ProfileScreenProps} from '../../types';
import {ProfileInfo} from './Info';
import stylesheet from './styles';

export const Profile: React.FC<ProfileScreenProps> = ({route}) => {
  const {publicKey} = route.params ?? {};

  const styles = useStyles(stylesheet);

  const notes = useRootNotes({authors: [publicKey]});

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
