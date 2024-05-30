## Mobile

Joyboy Mobile folder in React-native with Expo.
Pick a good first issue with the mobile labels, and let's contribute and keep building cool things in Open-source.

### Test

To test the project, run:

```bash
cd JoyboyCommunity
yarn install
yarn start
```

Select Expo web, Android or IOS. You can scan it with Expo GO on your phone.

### Screens of the mobile app
Recent implementation PoC on React Native.
Here is what we have on the mobile app on the first days, contributions welcome! 
Check the issues with the "mobile" labels.

Done:
- Create or import Nostr account
- Feed for notes
- See user page with notes 
- Create note on Nostr 

WIP:
- Read Nostr tags content
- View user page details: followers and follows, replies, likes, repost with all details of the users.
- Note interactions: Replies, Likes, Report, Tips
- My profile: Update my profile
- Feed: Search, Trending fees, For you, Discover
- DM with private message: NIP-17
- Public chat: NIP-28
 
[UI/UX proposal for video discussions](https://github.com/keep-starknet-strange/joyboy/discussions/48#discussion-6683225)

[UI video discussions](https://t.me/JoyboyStarknet/206/397)


Home page: 

<img src="../resources/screens/onboard.png" alt="onboard" height="300"/>

Create Nostr account

<img src="../resources/screens/create-account.png" alt="create account" height="300"/>

Feed by default:

<img src="../resources/screens/feed-default.png" alt="feed default" height="300"/>

User feed with notes:

<img src="../resources/screens/user-profile-details.png" alt="user-profile-details" height="300"/>

My profile page: WIP

<img src="../resources/screens/my-profile.png" alt="my-profile" height="300"/>


## How Nostr work

- [Nostr Implementation Possibilities](https://github.com/nostr-protocol/nips)
- [JoinStr: Decentralized CoinJoin Implementation Using Nostr](https://www.nobsbitcoin.com/joinstr-decentralized-coinjoin-implementation-using-nostr/)

### NIP-1
Nostr event are described like this on NIP-1:

```ts
export interface Event {
  kind: number; // 1 for note, 0 for profile,
  tags: string[][]; // NIP-10 for comment root and reply
  //
  content: string;
  created_at: number;
  pubkey: string;
  id: string;
  sig: string;
  [verifiedSymbol]?: boolean;
}
```

### NIP-10
- [NIP-10](https://github.com/nostr-protocol/nips/blob/master/10.md)

```ts
/** On the Tags string[][] of the note, you can check if the note are:
 *  repost, quote, reply root, reply comment, or a simple note. 
 * 
 * filter for tags :
 * ["e", "note_pubkey", "relay_url", "marker as reply | root | mention", "pubkey_author"]
 * ["p", "id_note","p1_note_reply"]
 * 
 */
```

