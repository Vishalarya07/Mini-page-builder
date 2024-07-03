import { useEffect } from "react";
import toast from "react-hot-toast";
import useModalStore from "../store/modalStore";

//Add the drag event listeners to the elements
const useDragEventHandler = (labelRef, inputRef, buttonRef) => {

    const { setIsModalOpen, setLabelState } = useModalStore((state) => ({
        setIsModalOpen: state.setIsModalOpen,
        setLabelState: state.setLabelState,
    }));

    useEffect(() => {
        const handleDragStartEvent = (e, element) => {
            element.classList.add('opacity-50');
        }

        const handleDragEndEvent = async (e, element, typeOfElement, titleOfElement) => {
            element.classList.remove('opacity-50');
            if (e.clientX >= parseInt(window.innerWidth * 0.8)) {
                toast.error("Cannot place item in sidebare")
            } else {
                await setLabelState({
                    type: typeOfElement,
                    title: titleOfElement,
                    xCord: e.clientX,
                    yCord: e.clientY
                })
                setIsModalOpen(true);
            }
        }

        const addEventHandlers = (element, typeOfElement, titleOfElement) => {
            if (element) {
                element.addEventListener('dragstart', (e) => handleDragStartEvent(e, element));
                element.addEventListener('dragend', (e) => handleDragEndEvent(e, element, typeOfElement, titleOfElement));
            }
        }

        const removeEventHandlers = (element) => {
            if (element) {
                element.removeEventListener('dragstart', handleDragStartEvent);
                element.removeEventListener('dragend', handleDragEndEvent);
            }
        };

        const label = labelRef.current;
        const input = inputRef.current;
        const button = buttonRef.current;

        addEventHandlers(label, 'div', 'This is a label');
        addEventHandlers(input, 'input', 'This is a input');
        addEventHandlers(button, 'button', 'Button');

        return () => {
            removeEventHandlers(label);
            removeEventHandlers(input);
            removeEventHandlers(button);
        };
    }, [buttonRef, inputRef, labelRef, setIsModalOpen, setLabelState])

}

export default useDragEventHandler;