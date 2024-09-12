Client for bin.scarsz.me (webpack compatible)

Currently, this package only allows fetching bins.

```ts
import * as bin from "scarsz-bin";

(async () => {
    // Fetch a bin with its UUID and key:
    console.log(await bin.get("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
    // Fetch a bin with its URL:
    console.log(await bin.getUrl("https://bin.scarsz.me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
})();
```
