import {z} from 'zod';

const NostrEventSchema = z.object({
  id: z.string(),
  kind: z.number(),
  content: z.string(),
  tags: z.array(z.array(z.string())),
  created_at: z.number(),
  sig: z.string(),
  pubkey: z.string(),
});

export const ClaimSchema = z.object({
  event: NostrEventSchema,
});
