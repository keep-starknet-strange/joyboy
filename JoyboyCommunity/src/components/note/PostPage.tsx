// src/screens/FeedScreen.js

import {Avatar} from '../avatar';
import {Author, AuthorContainer, Card, Content, ContentBox, Timestamp} from './styled';

export const PostPage: React.FC<{post: any}> = ({post}) => {
  const {content, author, timestamp, source, pubkey} = post;

  return (
    <Card>
      <AuthorContainer>
        <Avatar source={source} userId={pubkey} />
        <Author>{author}</Author>
        <Timestamp>{timestamp}</Timestamp>
      </AuthorContainer>

      <ContentBox>
        <Content>{content}</Content>
      </ContentBox>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Home", {
        })}
      ></TouchableOpacity> */}
    </Card>
  );
};
