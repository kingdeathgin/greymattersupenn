import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
	// Most pages are prerendered. Read them from Workers Static Assets so a
	// request does not have to initialize the full Next.js server bundle.
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
