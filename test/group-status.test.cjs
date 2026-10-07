const assert = require('node:assert/strict')
const { test } = require('node:test')

test('group status envelope carries the inner message and a 32-byte message secret', async () => {
  const { buildGroupStatusMessage } = await import('../lib/Socket/group-status.js')
  const inner = {
    conversation: 'Status text',
    messageContextInfo: { deviceListMetadataVersion: 1 },
  }

  const wrapped = buildGroupStatusMessage(inner)

  assert.deepEqual(wrapped.groupStatusMessageV2.message, inner)
  assert.equal(wrapped.messageContextInfo.messageSecret.length, 32)
  assert.equal(wrapped.messageContextInfo.deviceListMetadataVersion, 1)
})

test('group status envelope accepts a supplied secret', async () => {
  const { buildGroupStatusMessage } = await import('../lib/Socket/group-status.js')
  const inner = { imageMessage: { caption: 'hello' } }
  const secret = Buffer.alloc(32, 7)

  const wrapped = buildGroupStatusMessage(inner, secret)

  assert.deepEqual(wrapped.groupStatusMessageV2.message, inner)
  assert.deepEqual(wrapped.messageContextInfo.messageSecret, secret)
})
