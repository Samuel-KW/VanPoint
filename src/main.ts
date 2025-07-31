import "./styles/variables.css"
import "./styles/main.css"
import AddonManager from "./core/manager";
import { DemoAddon } from "./addons/demo/DemoAddon";
import { ViewportAddon } from "./addons/viewport/ViewportAddon";
import { loadInitialAddons } from "./ui/components/loader/loader";

const debug = true;

const addons = {
	core: [ ViewportAddon ],
	extended: [],
	custom: [],
	debug: [ DemoAddon ]
};

const manager = new AddonManager();

loadInitialAddons(manager, addons, debug);