import { useEffect } from "react"
import useModalStore from "../store/modalStore";
import useElementStore from "../store/elementStore";

//Add event listener to the window to detect the enter and delete key press
const useKeyDownHandler = (setIsAlreadyFormed, screenRef, setExportableObject) => {
    const { setIsModalOpen, setLabelState } = useModalStore((state) => ({
        setIsModalOpen: state.setIsModalOpen,
        setLabelState: state.setLabelState,
    }));

    const { selectedElement, resetSelectedElements } = useElementStore((state) => ({
        selectedElement: state.selectedElement,
        resetSelectedElements: state.resetSelectedElements,
    }));
    
    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Enter" && selectedElement !== null) {
                setIsAlreadyFormed(prev => true)
                await setLabelState({
                    type: selectedElement.tagName.toLowerCase(),
                    title: selectedElement.tagName === "DIV" ? selectedElement.textContent : selectedElement.tagName === "INPUT" ? selectedElement.value : selectedElement.innerHTML,
                    xCord: Number(selectedElement.style.left.split("px")[0]),
                    yCord: Number(selectedElement.style.top.split("px")[0]),
                    fontSize: Number(selectedElement.style.fontSize.split("px")[0]),
                    fontWeight: parseInt(selectedElement.style.fontWeight),
                })
                setIsModalOpen(true)
            }
            else if (e.key === "Delete" && document.querySelectorAll(".selected").length > 0) {
                if (screenRef.current) {
                    screenRef.current.removeChild(selectedElement);
                    setExportableObject((prev) => {
                        return prev.filter((ele) => {
                            // Matching the elements using their x and y positions
                            return `${selectedElement.style.left}${selectedElement.style.top}` !== `${ele.xCord}px${ele.yCord}px`
                        })
                    })
                    resetSelectedElements()
                }
            }
        }

        if (selectedElement !== null) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [resetSelectedElements, screenRef, selectedElement, setExportableObject, setIsAlreadyFormed, setIsModalOpen, setLabelState])
}

export default useKeyDownHandler;