import "./styles/variables.css"
import "./styles/main.css"
import AddonManager from "./core/manager";
import { DemoAddon } from "./addons/demo/DemoAddon";
import { ViewportAddon } from "./addons/viewport/ViewportAddon";

const debug = true;

const manager = new AddonManager();

// Enable core features
await manager.register(new ViewportAddon())
await manager.enableAll();

// Enable additional features
await manager.register(new DemoAddon());
await manager.enableAll();

console.log("All addons enabled");