import "./toolbar.css";

const hamburger = document.getElementById("hamburger-toolbar") as HTMLDivElement;

const toggle = function (this: HTMLElement, event: KeyboardEvent | MouseEvent) {
	if (event instanceof KeyboardEvent && event.key !== " ") {
		return;
	}
	this.classList.toggle("open");
};

hamburger.addEventListener("keydown", toggle);
hamburger.addEventListener("click", toggle);
