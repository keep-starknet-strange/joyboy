import {NDKUser} from '@nostr-dev-kit/ndk';
import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, Image, ScrollView, View} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';

import {Typography} from '../../components';
import {useGetPoolEventsNotesFromPubkey, useGetPoolUserQuery} from '../../hooks/useNostr';
import {INoteRepostParsed, IUserEvent, RootStackUserDetailScreenProps} from '../../types';
import {filterRepliesOnEvents} from '../../utils/filter';
import {NotesRoute, ReactionsRoute, RepliesRoute, RepostsRoute} from './routes';
import {
  BackButton,
  Container,
  ProfileContainer,
  TabBar,
  TabContainer,
  TabItem,
  Text,
} from './styled';

/** @TODO fetch user */
export const UserDetail: React.FC<RootStackUserDetailScreenProps> = ({route}) => {
  const {userId: userQuery} = route.params;

  const {data: poolUserQueryData, isLoading: poolUserQueryDataLoading} = useGetPoolUserQuery({
    pubkey: userQuery,
  });
  const {data: poolEventsNotesDataFromPubkey} = useGetPoolEventsNotesFromPubkey({
    pubkey: userQuery,
    kinds: [
      1, // note
      6, // repost
      //  + replies if NIP-10 with tags p and e t
      7, // reactions
    ],
  });

  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [eventProfile, setEventProfile] = useState<NDKUser | undefined>();
  const [routes] = React.useState([
    {key: 'posts', title: 'Posts'},
    {key: 'replies', title: 'Replies'},
    {key: 'reactions', title: 'Reactions'},
    {key: 'reposts', title: 'Reposts'},
  ]);

  const profile: IUserEvent = poolUserQueryData?.content
    ? JSON.parse(poolUserQueryData?.content)
    : null;

  const notesAllTags = poolEventsNotesDataFromPubkey?.filter((e) => e?.kind == 1);

  /** Parse content note as anoter event to repost */
  const reposts: INoteRepostParsed[] = useMemo(
    () =>
      (poolEventsNotesDataFromPubkey ?? [])
        ?.filter((e) => e.kind === 6)
        .map((e) => {
          const parsedNote = JSON.parse(e?.content);

          return {
            event: e,
            repost: parsedNote,
          };
        }),
    [],
  );
  const reactions = poolEventsNotesDataFromPubkey?.filter((e) => e?.kind == 7);
  const repliesFilter = filterRepliesOnEvents(notesAllTags);
  const noteEvents = notesAllTags?.filter((n) => n?.tags?.length == 0);

  const handleGoBack = (userId?: string) => {
    navigation.goBack();
  };

  const renderScene = useMemo(() => {
    return SceneMap({
      posts: () => <NotesRoute events={noteEvents} profile={profile} />,
      reactions: () => <ReactionsRoute reactions={reactions} profile={profile} />,
      reposts: () => <RepostsRoute reposts={reposts} profile={profile} />,
      replies: () => <RepliesRoute replies={repliesFilter} profile={profile} />,
    });
  }, [profile, noteEvents, reactions, reposts, repliesFilter]);

  const renderTabBar = (props) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TabBar>
          {props?.navigationState?.routes.map((route, i) => {
            return (
              <TabItem
                key={i}
                style={{
                  borderBottomWidth: 1,
                  // borderBottomColor: index === i ? theme.black[10] : "transparent",
                }}
                onPress={() => setIndex(i)}
              >
                <Typography
                  variant="ts15b"
                  align="left"
                  // colorCode={index === i ? theme.black[10] : theme.black[40]}
                >
                  {route.title}
                </Typography>
              </TabItem>
            );
          })}
        </TabBar>
      </View>
    );
  };

  return (
    <Container as={ScrollView}>
      <BackButton onPress={() => handleGoBack()}>
        <Typography
          variant="ts19m"
          //  colorCode={theme.black[100]}
        >
          Back
        </Typography>
      </BackButton>

      <View style={{position: 'relative', marginTop: -10, height: 270}}>
        {profile?.banner && (
          <Image
            source={{uri: profile?.banner}}
            style={{
              width: '100%',

              height: 200,
              resizeMode: 'cover',
              marginTop: 8,
            }}
          />
        )}

        <View style={{position: 'relative'}}>
          <Image
            source={{
              uri: profile?.picture ?? require('../../../assets/joyboy-logo.png'),
            }}
            style={{
              borderWidth: 2,
              borderColor: 'white',
              height: 100,
              width: 100,
              resizeMode: 'cover',
              borderRadius: 50,
              left: 12,
              top: 0,
              transform: [{translateY: -50}],
            }}
          />
        </View>
      </View>

      <ProfileContainer>
        {poolUserQueryDataLoading && <ActivityIndicator></ActivityIndicator>}
        <Text
        // numberOfLines={1}
        // lineBreakMode="tail"
        >
          {userQuery}
        </Text>
        <Text
        // variant="ts19m"
        // colorCode={theme.black[10]}
        >
          {eventProfile?.profile?.name ?? profile?.name}
        </Text>

        <Text
        // variant="ts15r"
        // colorCode={theme.black[10]}
        >
          {eventProfile?.profile?.bio ?? profile?.about}
        </Text>

        {/* Render user details here */}
      </ProfileContainer>

      <TabContainer>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          // initialLayout={{ width: layout.width }}
        />
      </TabContainer>
    </Container>
  );
};
