import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {parsingEventContent, useGetPoolEventById} from '../../hooks/useNostr';
import {RootStackNoteDetailScreenProps} from '../../types';
import {Container, ContentContainer, ProfileImage, Text, Timestamp} from './styled';

export const NoteDetail: React.FC<RootStackNoteDetailScreenProps> = ({route, navigation}) => {
  const {noteId} = route.params;
  const {data: singlePoolEventData} = useGetPoolEventById(noteId);

  const [imgUser, setImageUser] = useState<string | undefined>();

  const contentParsed = parsingEventContent(singlePoolEventData);

  const handleProfilePress = (userId: string) => {
    navigation.navigate('UserDetail', {userId});
  };
  return (
    <Container>
      {/* <Text lineBreakMode="tail" style={styles.text} numberOfLines={2}>
        {noteId}
      </Text> */}

      {singlePoolEventData && singlePoolEventData?.created_at && (
        <Timestamp>
          {new Date(Number(singlePoolEventData?.created_at) * 1000)?.toISOString()}
        </Timestamp>
      )}

      <TouchableOpacity onPress={() => handleProfilePress(singlePoolEventData?.pubkey)}>
        <ProfileImage source={imgUser ?? require('../../../assets/joyboy-logo.png')} />
      </TouchableOpacity>

      <ContentContainer>
        {singlePoolEventData?.id == noteId && contentParsed && (
          <Text lineBreakMode="tail">{contentParsed}</Text>
        )}
      </ContentContainer>
      {/* Render post details here */}

      {/* @TODO render metadata */}

      {/* TODO render interactions NOSTR */}
    </Container>
  );
};
