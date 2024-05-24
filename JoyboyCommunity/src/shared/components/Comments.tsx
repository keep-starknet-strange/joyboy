import React from 'react';
import {FlatList, View} from 'react-native';

import PostComment from './PostComment';

const mockEvents = [
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'Lets say that One Piece is awesome',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'What about Naruto?',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
  {
    post: {
      content: 'mock content',
      author: 'Roronoa zoro',

      id: '1',
      created_at: '2021-09-01T00:00:00Z',
      pubkey: '1234567890',
    },
    event: {
      content: 'Yeaaaah Naruto is sick',
      created_at: 1680638952,
      id: '12e701f23d365c558e7aa1a6f75f0477fb8593d4ad8421c4b326f8193ed42fc7',
      kind: 1,
      pubkey: '49e2566f8b1ef0da8aeb89865a862ead30dd5e1fc1e540edebf980a04fe9e853',
      sig: 'c931395c5db7538d159d6012115b0db9b1d9a5ada52132437cddc1790982727555d0d618f109fce372f0ca0ae33d29a8d3ffae1af879e278fc2ce3c6d123c658',
      tags: [
        ['e', 'a8de2eb8a069fecd33246cd921124541d6242ea76ee85c38bf45ee9b5fb3feb5'],
        ['p', '1989034e56b8f606c724f45a12ce84a11841621aaf7182a1f6564380b9c4276b'],
      ],
    },
    sourceUser: null,
  },
];
function Comments() {
  return (
    <FlatList
      horizontal={false}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      data={mockEvents}
      ItemSeparatorComponent={() => <View style={{height: 18}} />}
      renderItem={({item}) => {
        return <PostComment event={item.event} post={item.post} sourceUser={item.sourceUser} />;
      }}
    />
  );
}

export default Comments;
