import "./styles/variables.css"
import "./styles/global.css"
import AddonManager from "./core/manager";
import { DemoAddon } from "./addons/demo/DemoAddon";
import { ViewportAddon } from "./addons/viewport/ViewportAddon";
import { loadInitialAddons } from "./ui/components/addonLoaderScreen/loader";

const debug = true;

const addons = {
	core: [ ViewportAddon ],
	extended: [],
	custom: [],
	debug: [ DemoAddon ]
};

const manager = new AddonManager();

loadInitialAddons(manager, addons, debug);