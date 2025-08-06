import type { AddonContext } from "../../core/context";
import { Addon } from "../Addon";

const colors = [
	"#ff073a",
	"#ff9933",
	"#fafa37",
	"#39ff14",
	"#7df9ff",
	"#ff6ec7",
	"#bf00ff",
	"#00ffff",
	"#ff5f1f",
	"#ccff00",
	"#fe4164",
	"#00bfff",
	"#e0ffff",
	"#ff1493",
	"#8dffcd",
	"#ff00ff",
	"#ff66cc",
	"#ffff33",
	"#adff2f" 
];

export class DebugBordersAddon extends Addon {
	id = "debugBorders";
	name = "Debug Borders";
	description = "Debug UI element borders";

	// private hidden = false;

	async onRegister(_: AddonContext) {}

	async onEnable(ctx: AddonContext) {
		let index = 0;
		for (const name in ctx.ui) {
			const elem = ctx.ui[name as keyof typeof ctx.ui];
			elem.setAttribute("data-default-border", elem.style.border);
			elem.style.border = "3px solid " + colors[index++ % colors.length];
		}
	}

	async onDisable(ctx: AddonContext) {
		for (const name in ctx.ui) {
			const elem = ctx.ui[name as keyof typeof ctx.ui];
			elem.style.border = elem.getAttribute("data-default-border") || "";
			elem.removeAttribute("data-default-border");
		}
	}

	async onDestroy(_: AddonContext) {}

	exports() {
		return {};
	}
}
