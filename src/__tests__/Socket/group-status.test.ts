import type { proto } from '../../../WAProto/index.js'
import { buildGroupStatusMessage } from '../../Socket/group-status'
import { normalizeMessageContent } from '../../Utils/messages'

describe('buildGroupStatusMessage', () => {
it('wraps content and stores the message secret on the outer message', () => {
const message = {
conversation: 'Status text',
 messageContextInfo: { deviceListMetadataVersion: 1 }
} as proto.IMessage
const secret = Buffer.alloc(32, 7)

const wrapped = buildGroupStatusMessage(message, secret)

expect(wrapped.groupStatusMessageV2?.message).toEqual(message)
expect(wrapped.messageContextInfo?.messageSecret).toEqual(secret)
expect(wrapped.messageContextInfo?.deviceListMetadataVersion).toBe(1)
})

it('creates a fresh 32-byte secret when none is supplied', () => {
const first = buildGroupStatusMessage({ conversation: 'One' })
const second = buildGroupStatusMessage({ conversation: 'Two' })

expect(first.messageContextInfo?.messageSecret).toHaveLength(32)
expect(second.messageContextInfo?.messageSecret).toHaveLength(32)
expect(first.messageContextInfo?.messageSecret).not.toEqual(second.messageContextInfo?.messageSecret)
})

it('detects media types after unwrapping a group status', () => {
const imageStatus = buildGroupStatusMessage({
imageMessage: { mimetype: 'image/jpeg' }
} as proto.IMessage)
const videoStatus = buildGroupStatusMessage({
videoMessage: { mimetype: 'video/mp4' }
} as proto.IMessage)
const audioStatus = buildGroupStatusMessage({
audioMessage: { mimetype: 'audio/ogg', ptt: true }
} as proto.IMessage)

expect(normalizeMessageContent(imageStatus)?.imageMessage).toBeDefined()
expect(normalizeMessageContent(videoStatus)?.videoMessage).toBeDefined()
expect(normalizeMessageContent(audioStatus)?.audioMessage).toBeDefined()
})
})
