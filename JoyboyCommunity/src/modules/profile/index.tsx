import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';
import {useTheme} from 'styled-components/native';

import {Typography} from '../../components';
import {useGetPoolEventsNotesFromPubkey, useGetPoolUserQuery} from '../../hooks/useNostr';
import {useAuth} from '../../store/auth';
import {INoteRepostParsed, IUserEvent} from '../../types';
import {filterRepliesOnEvents} from '../../utils/filter';
import {NotesRoute, ReactionsRoute, RepliesRoute, RepostsRoute} from './routes';
import {
  AboutContainer,
  CoverImage,
  ImageContainer,
  ProfileImage,
  TabBar,
  TabBarContainer,
  TabItem,
} from './styled';

export default function Profile() {
  const theme = useTheme();
  const layout = useWindowDimensions();

  const {publicKey} = useAuth();
  const {data: poolUserQueryData} = useGetPoolUserQuery({pubkey: publicKey});
  const {data: poolEventsNotesDataFromPubkey} = useGetPoolEventsNotesFromPubkey({
    pubkey: publicKey,
    kinds: [
      1, // note
      6, // repost
      7, // reactions
    ],
  });

  const [index, setIndex] = React.useState(0);
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
        .filter((e) => e?.kind === 6)
        .map((e) => {
          const parsedNote = JSON.parse(e?.content);

          return {
            event: e,
            repost: parsedNote,
          };
        }),
    [poolEventsNotesDataFromPubkey],
  );
  const reactions = poolEventsNotesDataFromPubkey?.filter((e) => e?.kind == 7);
  const repliesFilter = filterRepliesOnEvents(notesAllTags);
  const noteEvents = notesAllTags?.filter((n) => n?.tags?.length == 0);

  const renderTabBar = (props) => {
    return (
      <TabBarContainer>
        <TabBar>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TabItem
                key={i}
                style={{
                  borderBottomColor: index === i ? theme.black[10] : 'transparent',
                }}
                onPress={() => setIndex(i)}
              >
                <Typography
                  variant="ts15b"
                  align="left"
                  colorCode={index === i ? theme.black[10] : theme.black[40]}
                >
                  {route.title}
                </Typography>
              </TabItem>
            );
          })}
        </TabBar>
      </TabBarContainer>
    );
  };

  const renderScene = useMemo(() => {
    return SceneMap({
      posts: () => <NotesRoute events={noteEvents} profile={profile} />,
      reactions: () => <ReactionsRoute reactions={reactions} profile={profile} />,
      reposts: () => <RepostsRoute reposts={reposts} profile={profile} />,
      replies: () => <RepliesRoute replies={repliesFilter} profile={profile} />,
    });
  }, [profile, noteEvents, reactions, reposts, repliesFilter]);

  return (
    <View style={{flex: 1}}>
      <ImageContainer>
        <CoverImage source={{uri: 'https://picsum.photos/200/300'}} />

        <View style={{position: 'relative'}}>
          <ProfileImage source={{uri: 'https://picsum.photos/201/300'}} />
        </View>
      </ImageContainer>

      <AboutContainer>
        <Typography variant="ts19m" colorCode={theme.black[10]}>
          {publicKey ?? ''}
        </Typography>

        <Typography variant="ts19m" colorCode={theme.black[10]}>
          {profile?.display_name ?? ''}
        </Typography>

        <Typography variant="ts15r" colorCode={theme.black[10]}>
          {profile?.about}
        </Typography>

        {/* TODO navigate to edit profile */}

        <View>
          <Pressable>
            <Typography>Edit your profile</Typography>
          </Pressable>
        </View>
      </AboutContainer>

      <View style={{flex: 1, paddingTop: 8}}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
    </View>
  );
}
