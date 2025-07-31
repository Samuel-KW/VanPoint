import type { AddonContext } from "../core/context";

export abstract class Addon {
  abstract id: string;
  abstract name: string;
  enabled: boolean = false;

  abstract onRegister(context: AddonContext): Promise<void> | void;
  abstract onEnable(context: AddonContext): Promise<void> | void;
  abstract onDisable(context: AddonContext): Promise<void> | void;
  abstract onDestroy(context: AddonContext): Promise<void> | void;
  abstract exports(): Record<string, unknown>;
}
