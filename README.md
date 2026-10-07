# NYXCORE Socket

[![npm version](https://img.shields.io/npm/v/nyxcoresocket)](https://www.npmjs.com/package/nyxcoresocket)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

NYXCORE Socket is a multi-device WhatsApp Web socket package based on the
Baileys `7.0.0-rc13` protocol source. It provides the standard socket,
authentication, message, media, group, and protocol APIs, with an additional
`sendGroupStatus()` method for publishing native WhatsApp group statuses.

## Install

```sh
npm install nyxcoresocket
```

## Requirements

- Node.js 20 or newer.
- For CommonJS `require()` of this ESM package: Node.js 20.19+, 22.12+, or a
  newer supported release.
- A WhatsApp account and authentication state that you control.
- A group JID ending in `@g.us` when sending a group status.

The package does not include WhatsApp login credentials or session files.
Never commit your authentication directory or credentials to a public
repository.

## Quick start

```js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("nyxcoresocket");

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("WhatsApp connected");
    }
  });

  return sock;
}
```

Use your normal WhatsApp pairing or login flow. Wait for the socket connection
to open before sending messages.

For an ESM project:

```js
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "nyxcoresocket";
```

## Send a group status

`sendGroupStatus(groupJid, content, options?)` publishes a native group status.
The destination group determines the audience; WhatsApp membership, privacy
settings, and client behavior still apply.

### Text

```js
const sent = await sock.sendGroupStatus(
  "120363000000000000@g.us",
  { text: "Hello group" },
  { backgroundColor: "#25D366", font: 2 },
);

console.log("Status message ID:", sent.key.id);
```

`backgroundColor` and `font` are optional text styling options.

### Image or video

```js
await sock.sendGroupStatus(groupJid, {
  image: imageBuffer,
  caption: "A photo for the group",
});

await sock.sendGroupStatus(groupJid, {
  video: videoBuffer,
  caption: "A video for the group",
});
```

The socket generates the message, uploads media, wraps it in the group-status
envelope, and relays it to the specified group. The method returns the
generated message object. It throws if the destination is not a group JID or
the socket is not logged in.

## Compatibility

The protocol implementation is pinned to Baileys `7.0.0-rc13`. The package
exports the socket factory and common authentication, message, type, binary,
and protocol utilities. Keep dependencies that your application imports
directly, and avoid mixing utilities from incompatible protocol versions.

## Tests

From the package source directory:

```sh
npm install
npm run build
npm test
npm run test:group-status
```

The group-status tests check the message envelope and its 32-byte message
secret. Offline tests do not connect to WhatsApp or verify how a particular
WhatsApp client displays a status; test live behavior only with an account and
group you control.

## License and attribution

NYXCORE Socket is released under the MIT License. The protocol source is based
on Baileys `7.0.0-rc13`; retain the included license and copyright notices
when redistributing source.

NYXCORE is not affiliated with or endorsed by WhatsApp. WhatsApp and related
marks belong to their respective owners. Use accounts you control and follow
applicable laws and WhatsApp's terms.
