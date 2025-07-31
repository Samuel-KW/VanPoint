import "./styles/variables.css"
import "./styles/main.css"
import AddonManager from "./core/manager";
import { DemoAddon } from "./addons/demo/DemoAddon";

const manager = new AddonManager();
await manager.register(new DemoAddon());
await manager.enableAll();

console.log("All addons enabled");