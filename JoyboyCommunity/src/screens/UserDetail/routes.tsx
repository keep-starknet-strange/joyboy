import { FlatList, View } from "react-native";
import { Event as EventNostr } from "nostr-tools";
import { Post } from "../../shared/components/Post";
import { Divider } from "../../components";
import { INoteRepostParsed, IUserEvent } from "../../types";

export const NotesRoute: React.FC<{
  events: EventNostr[];
  profile: IUserEvent;
}> = ({ events, profile }) => {
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        // paddingBottom: bottomBarHeight,
      }}
      data={events}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return (
          <Post
            //  post={item}
            sourceUser={profile?.picture}
            event={item}
          />
        );
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

/** TODO fix issue multi renders replies */
export const RepliesRoute: React.FC<{
  replies: EventNostr[];
  profile: IUserEvent;
}> = ({ replies, profile }) => {
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
      }}
      data={replies}
      // keyExtractor={(item,index) => item?.id}
      keyExtractor={(item, index) => index?.toString()}
      renderItem={({ item, index }) => {
        return <Post key={index} event={item} sourceUser={profile?.picture} />;
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

export const RepostsRoute: React.FC<{
  reposts: INoteRepostParsed[];
  profile: IUserEvent;
}> = ({ reposts, profile }) => {
  // const bottomBarHeight = useBottomTabBarHeight();

  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        // paddingBottom: bottomBarHeight,
      }}
      data={reposts}
      keyExtractor={(item) => item?.event?.id}
      renderItem={({ item }) => {
        return (
          <Post
            // post={item}
            sourceUser={profile?.picture}
            event={item?.event}
            repostedEvent={item?.repost}
          />
        );
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};

export const ReactionsRoute: React.FC<{
  reactions: EventNostr[];
  profile: IUserEvent;
}> = ({ reactions, profile }) => {
  // const bottomBarHeight = useBottomTabBarHeight();
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 16,
        // paddingBottom: bottomBarHeight,
      }}
      data={reactions}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => {
        return (
          <Post
            //  post={item}
            sourceUser={profile?.picture}
            event={item}
          />
        );
      }}
      ItemSeparatorComponent={() => (
        <View style={{ marginVertical: 18 }}>
          <Divider />
        </View>
      )}
    />
  );
};
