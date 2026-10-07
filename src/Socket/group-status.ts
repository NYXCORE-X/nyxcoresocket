import { randomBytes } from 'crypto'
import type { proto } from '../../WAProto/index.js'

/**
 * Wraps a normal message in WhatsApp's group-status envelope.
 * The message secret belongs to the outer message context.
 */
export const buildGroupStatusMessage = (
message: proto.IMessage,
messageSecret: Uint8Array = randomBytes(32)
): proto.IMessage => ({
groupStatusMessageV2: { message },
messageContextInfo: {
...message.messageContextInfo,
messageSecret
}
})
