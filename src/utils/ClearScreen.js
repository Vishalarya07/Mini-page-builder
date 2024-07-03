export const clearScreen = (screenRef) => {
    localStorage.removeItem("pageLayout");
    const elements = document.querySelectorAll(".Draggable");
    elements.forEach((ele) => {
        screenRef.current.removeChild(ele);
    })
}