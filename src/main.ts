import "./styles/variables.dark.forest.css"
import "./styles/global.css"
import "./ui/components/toolbar/toolbar.ts"
import "./ui/components/interface/interface.ts"
import "./ui/components/propertyMenu/property.ts"
import "./ui/components/widgets/widgets.ts"
import AddonManager from "./core/manager";
import { ViewportAddon } from "./addons/viewport/ViewportAddon";
import { loadInitialAddons } from "./ui/components/addonLoaderScreen/loader";
import { GeometryAddon } from "./addons/geometry/GeometryAddon.ts";
import { PreviewAddon } from "./addons/preview/PreviewAddon.ts";

const debug = true;

const addons = {
	core: [ ViewportAddon, GeometryAddon, PreviewAddon ],
	extended: [ ],
	custom: [],
	debug: []
};

const manager = new AddonManager(debug);

loadInitialAddons(manager, addons, debug);