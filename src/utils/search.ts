
export async function search(query: string) {
    const url = "https://www.gsmarena.com/res.php3?sSearch=";
    window.open(url + encodeURIComponent(query), "_blank");
}