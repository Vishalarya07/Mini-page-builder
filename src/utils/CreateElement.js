import toast from "react-hot-toast";

// Function to create a new element to add to the screen
export const createElement = (type, xCord, yCord, title, fontWeight, fontSize, setSelectedElement, setExportableObject) => {
    const newElement = document.createElement(type);
    newElement.draggable = true;
    newElement.classList.add("Draggable")
    newElement.classList.add(`Draggable${type}`)
    newElement.style.left = `${xCord}px`
    newElement.style.top = `${yCord}px`
    newElement.style.fontWeight = fontWeight
    newElement.style.fontSize = `${fontSize}px`
    if (type === "div") {
        newElement.textContent = title;
    }
    if (type === "input") {
        newElement.placeholder = "Press Enter to edit..."
        newElement.value = title
        newElement.readOnly = true
    }
    if (type === "button") newElement.innerHTML = title

    // Add the dragend event handler to update the position on moving the element across the screen
    newElement.ondragend = (e) => {
        if (e.clientX >= parseInt(window.innerWidth * 0.8)) {
            toast.error("Cannot place item in sidebar")
        } else {
            const prevLeft = Number(newElement.style.left.split("px")[0])
            const prevTop = Number(newElement.style.top.split("px")[0])
            setExportableObject((prev) => {
                return prev.map((ele) => {
                    if (ele.xCord === prevLeft && ele.yCord === prevTop) {
                        return {
                            ...ele,
                            xCord: e.clientX,
                            yCord: e.clientY
                        };
                    } else {
                        return ele;
                    }
                });
            });
            newElement.style.left = `${e.clientX}px`
            newElement.style.top = `${e.clientY}px`
        }
    }

    // Add the onclick event to select or unselect elements
    newElement.onclick = async(e) => {
        if (e.target.classList.contains("selected")) {
            await setSelectedElement(null)
            e.target.classList.remove("selected")
        } else {
            const selectedDivs = document.querySelectorAll(".selected");
            if (selectedDivs.length > 0) {
                selectedDivs.forEach((ele) => { ele.classList.remove("selected") })
            }
            setSelectedElement(newElement)
            e.target.classList.add("selected")
        }
    }

    return newElement;
}