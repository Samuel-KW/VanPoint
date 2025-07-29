const fileInputToolbar = document.getElementById("load-image") as HTMLInputElement;
const overlay = document.getElementById("start-overlay") as HTMLDivElement;

fileInputToolbar.addEventListener("click", () => {
	overlay.style.display = "block";
});