import { useEffect } from "react";
import useElementStore from "../store/elementStore";

//Add an event listener to listen to clicks on the screen
const useMouseDownHandler = (screenRef) => {

    const { resetSelectedElements } = useElementStore((state) => ({
        resetSelectedElements: state.resetSelectedElements
    }));

    useEffect(() => {
        const screen = screenRef.current;
        const handleMouseDownEvent = (e) => {
            if (e.target === screen) {
                document.querySelectorAll(".selected").forEach((ele) => {
                    ele.classList.remove("selected")
                })
                resetSelectedElements()
            }
        }
        if (screen) {
            screen.addEventListener("mousedown", handleMouseDownEvent)
        }

        return () => {
            if (screen) {
                screen.removeEventListener("mousedown", handleMouseDownEvent);
            }
        }
    }, [screenRef, resetSelectedElements])
}

export default useMouseDownHandler;