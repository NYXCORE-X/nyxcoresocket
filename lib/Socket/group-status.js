import { randomBytes } from 'crypto';
const buildGroupStatusMessage = (message, messageSecret = randomBytes(32)) => ({
    groupStatusMessageV2: { message },
    messageContextInfo: {
        ...message.messageContextInfo,
        messageSecret
    }
});
export { buildGroupStatusMessage };
