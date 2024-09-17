Client for bin.scarsz.me (webpack compatible)

```ts
import * as bin from "scarsz-bin";

(async () => {
    // Fetch a bin with its UUID and key:
    console.log(await bin.get("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
    // Fetch a bin with its URL:
    console.log(await bin.getUrl("https://bin.scarsz.me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
    // Post a bin
    console.log(await post({ files: [{ name: "file-name.txt", content: "file content", type: "text/plain" }] }));
})();
```
