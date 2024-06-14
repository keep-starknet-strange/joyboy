import { NextResponse, NextRequest } from 'next/server';

const nostr_keys = {
  joyboy: {
    pubkey: 'npub1nq5ckz62p4vxwu08lpx8ggu5k5qn6d7pdtcfyj7hae3wc6j30fwseex2rq',
  },
  testnet: {
    pubkey: 'b0635d6a9851d3aed0cd6c495b282167acf761729078d975fc341b22650b07b9'
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name || !nostr_keys[name]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const nostr_key = nostr_keys[name];
  const response = {
    names: {
      [name]: nostr_key.pubkey
    },
  };

  const nextResponse = NextResponse.json(response);
  nextResponse.headers.set('Access-Control-Allow-Origin', '*');

  return nextResponse;
}
