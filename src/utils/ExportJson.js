import toast from "react-hot-toast";
export const exportJson = (data) => {
    if (data.length === 0) toast.error("Your screen is empty!! Build something first")
    else {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "page.json";

        link.click();
    }

}