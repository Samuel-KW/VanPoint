import "./imageSelectorStyle.css"
import { Addon, type AddonContext } from "../Addon";

export class ImageSelectorAddon extends Addon {
	id = "imageSelector";
	name = "Image Selector";
	description = "Allows uploading custom images to the scene.";

	private file?: File;
	private imageUrl?: string;

	private container?: HTMLDivElement;
	private fileInput?: HTMLInputElement;
	private preview?: HTMLImageElement;
	private submit?: HTMLButtonElement;

	private pasteListener?: (event: ClipboardEvent) => void;

	async onRegister(ctx: AddonContext) {

		const innerContainer = document.createElement("div");
		
		const uploadPanel = document.createElement("div");
		uploadPanel.className = "upload-panel";

		const previewPanel = document.createElement("div");
		previewPanel.className = "preview-panel";

		this.container = document.createElement("div");
		this.container.className = "image-selector-container";
		
		this.fileInput = document.createElement("input");
		this.fileInput.type = "file";
		this.fileInput.accept = "image/*";
		
		this.preview = document.createElement("img");
		this.preview.draggable = false;
		this.preview.alt = "Uploaded image preview";

		this.submit = document.createElement("button");
		this.submit.innerHTML = "Submit";
		this.submit.style = `margin-top: 10px;`;
		this.submit.disabled = true;

		const handleFile = (file: File) => {
			if (!file.type.startsWith("image/")) {
				console.warn("Only image files are supported!");
				return;
			}
			this.file = file;
			if (this.submit && this.preview) {
				this.submit.disabled = false;
				this.preview.style.display = "block";
				this.preview.src = URL.createObjectURL(file);
			}
		};

		this.container.addEventListener("dragover", function (e) {
			e.preventDefault();
			this.style.backgroundColor = "var(--bg-color-3)";
		});

		this.container.addEventListener("dragleave", function () {
			this.style.backgroundColor = "var(--bg-color-6)";
		});

		this.container.addEventListener("drop", function(e) {
			e.preventDefault();
			this.style.backgroundColor = "var(--bg-color-6)";
			const files = e.dataTransfer?.files;
			if (files && files.length > 0) {
				handleFile(files[0]);
			}
		});

		this.fileInput.addEventListener("change", function () {
			const file = this.files?.[0];
			if (file) {
				handleFile(file);
			}
		});

		this.pasteListener = (e) => {
			const items = e.clipboardData?.items;
			if (items) {
				for (const item of items) {
					if (item.kind === "file" && item.type.startsWith("image/")) {
						const file = item.getAsFile();
						if (file) {
							handleFile(file);
							if (this.fileInput) {
								this.fileInput.value = "";
							}
							break;
						}
					}
				}
			}
		};

		this.submit.addEventListener("click", () => this.submitFile(ctx));

		uploadPanel.appendChild(this.fileInput);
		uploadPanel.appendChild(this.submit);
		previewPanel.appendChild(this.preview);

		innerContainer.appendChild(uploadPanel);
		innerContainer.appendChild(previewPanel);
		this.container.appendChild(innerContainer);
	}

	async onEnable(ctx: AddonContext) {
		if (!this.container || !this.pasteListener) {
			return;
		}

		document.addEventListener("paste", this.pasteListener);

		if (ctx.debug) {
			const fileName = "subway.avif";
			const req = await fetch("assets/" + fileName);
			const blob = await req.blob();
			const fileType = blob.type;

			const file = new File([blob], fileName, { type: fileType });
			const imageUrl = URL.createObjectURL(file);
			const img = new Image();
			img.onload = () => {
				ctx.events.emit("image:load", {
					file: file,
					src: imageUrl,
					image: img,
					width: img.width,
					height: img.height
				});
			};
			img.src = imageUrl;
		} else {
			document.body.appendChild(this.container);
		}
	}

	async onDisable(_: AddonContext) {
		if (!this.container || !this.pasteListener) {
			return;
		}

		document.body.removeChild(this.container);
		document.removeEventListener("paste", this.pasteListener);

	}

	async onDestroy(_: AddonContext) {
		if (this.imageUrl) {
			URL.revokeObjectURL(this.imageUrl);
		}
		this.file = undefined;
	}

	exports() {
		return {};
	}

	submitFile(ctx: AddonContext) {
		if (!this.file) {
			return;
		}

        this.imageUrl = URL.createObjectURL(this.file);
		
		const img = new Image();
		img.onload = () => {
			if (!this.file || !this.container) {
				return;
			}
			
			ctx.events.emit("image:load", {
				file: this.file,
				src: this.imageUrl,
				image: img,
				width: img.width,
				height: img.height
			});

			this.container.style.pointerEvents = "none";
			this.container.style.animation = "fade-out 500ms ease-in-out forwards";

			setTimeout(() => this.container?.remove(), 3000);
		};
		img.src = this.imageUrl;
	}
}