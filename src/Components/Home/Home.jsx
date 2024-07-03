import React, { useCallback, useEffect, useRef, useState } from 'react'
import Modal from 'react-modal';
import ModalForm from '../ModalForm/ModalForm';
import { exportJson } from '../../utils/ExportJson';
import useModalStore from '../../store/modalStore';
import { createElement } from '../../utils/CreateElement';
import useElementStore from '../../store/elementStore';
import { clearScreen } from '../../utils/ClearScreen';
import useDragEventHandler from '../../hooks/useDragEventHandler';
import useMouseDownHandler from '../../hooks/useMouseDownHandler';
import useKeyDownHandler from '../../hooks/useKeyDownHandler';

const Home = () => {

    const { isModalOpen, setIsModalOpen, labelState, resetLabelState } = useModalStore((state) => ({
        isModalOpen: state.isModalOpen,
        setIsModalOpen: state.setIsModalOpen,
        labelState: state.labelState,
        setLabelState: state.setLabelState,
        resetLabelState: state.resetLabelState,
    }));

    const { selectedElement, setSelectedElement, resetSelectedElements } = useElementStore((state) => ({
        selectedElement: state.selectedElement,
        setSelectedElement: state.setSelectedElement,
        resetSelectedElements: state.resetSelectedElements
    }));

    const labelRef = useRef(null);
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const screenRef = useRef(null);

    const [isAlreadyFormed, setIsAlreadyFormed] = useState(false);

    const [ExportableObject, setExportableObject] = useState([])

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            width: '40vw',
            transform: 'translate(-50%, -50%)'
        },
    };

    // Custom hooks to handle drag, click, and key press events
    useDragEventHandler(labelRef, inputRef, buttonRef);
    useMouseDownHandler(screenRef);
    useKeyDownHandler(setIsAlreadyFormed, screenRef, setExportableObject);

    const onModalSubmit = useCallback(async () => {

        const updateExistingElement = () => {
            const prevLeft = selectedElement.style.left
            const prevTop = selectedElement.style.top

            if (labelState.type === "div") selectedElement.textContent = labelState.title;
            if (labelState.type === "input") selectedElement.value = labelState.title;
            if (labelState.type === "button") selectedElement.innerHTML = labelState.title;

            selectedElement.style.left = `${labelState.xCord}px`
            selectedElement.style.top = `${labelState.yCord}px`
            selectedElement.style.fontWeight = labelState.fontWeight
            selectedElement.style.fontSize = `${labelState.fontSize}px`

            setIsAlreadyFormed(prev => false);

            setExportableObject((prev) => {
                return prev.map((obj) => {
                    // Matching the elements using their x and y positions
                    if (obj && `${obj.xCord}px` === prevLeft && `${obj.yCord}px` === prevTop) {
                        return {
                            ...obj,
                            text: labelState.title,
                            xCord: parseInt(labelState.xCord),
                            yCord: parseInt(labelState.yCord),
                            fontSize: parseInt(labelState.fontSize),
                            fontWeight: parseInt(labelState.fontWeight)
                        }
                    } else return obj
                })
            })
            resetLabelState();
        }

        const createNewElement = async () => {
            const newElement = await createElement(labelState.type, labelState.xCord, labelState.yCord, labelState.title, labelState.fontWeight, labelState.fontSize, setSelectedElement, setExportableObject);
            if (screenRef.current) screenRef.current.append(newElement);
            const newlabelObject = {
                tag: labelState.type,
                text: labelState.title,
                xCord: parseInt(labelState.xCord),
                yCord: parseInt(labelState.yCord),
                fontSize: parseInt(labelState.fontSize),
                fontWeight: parseInt(labelState.fontWeight)
            }
            setExportableObject(prevExportableObject => [...prevExportableObject, newlabelObject]);
        }

        // Whenver user submits the form, check if element already exists, then update or create a new element
        if (isAlreadyFormed) {
            updateExistingElement();
        } else {
            createNewElement();
        }
        setIsModalOpen(false)
    }, [isAlreadyFormed, labelState, resetLabelState, selectedElement, setIsModalOpen, setSelectedElement])

    // Restore the layout from the localstorage on page refresh
    useEffect(() => {
        const savedLayout = window.localStorage.getItem('pageLayout');
        if (savedLayout) {
            JSON.parse(savedLayout).forEach((obj) => {
                const newElement = createElement(obj.tag, obj.xCord, obj.yCord, obj.text, obj.fontWeight, obj.fontSize, setSelectedElement, setExportableObject);
                screenRef.current.append(newElement);
                setExportableObject(prevExportableObject => [...prevExportableObject, obj]);
            });
        }
    }, [setSelectedElement]);

    // Update the localstorage with changes in any elements
    useEffect(() => {
        localStorage.setItem("pageLayout", JSON.stringify(ExportableObject));
    }, [ExportableObject])

    useEffect(() => {
        Modal.setAppElement("body")
    }, [])

    return (
        <div className='h-screen w-screen flex overflow-hidden'>
            <div className="bg-gray-200 w-4/5 flex-grow relative select-none">
                <div
                    ref={screenRef}
                    onDragOver={(e) => e.preventDefault()}
                    className="h-full pageBuilderScreen"
                >
                    <button
                        onClick={() => {
                            resetSelectedElements()
                            setExportableObject([])
                            clearScreen(screenRef)
                        }}
                        className='absolute top-2 left-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded outline-none'
                    >Clear Screen</button>

                    <button
                        onClick={() => {
                            exportJson(ExportableObject)
                            setExportableObject([])
                            clearScreen(screenRef)
                        }}
                        className='absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded outline-none'
                    >Export</button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => { setIsModalOpen(false) }}
                    style={customStyles}
                >
                    <ModalForm onModalSubmit={onModalSubmit} />
                </Modal>

            </div>
            <div className="bg-[#2D2D2D] w-1/5 flex-grow ml-auto p-5">
                <div className='font-semibold text-2xl text-white select-none'>Blocks</div>
                <div className="flex flex-col mt-5 gap-2">
                    <div ref={labelRef} className="p-2 bg-white rounded-sm cursor-move flex gap-2 items-center paigeBuilderLabel" draggable="true">
                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.375 0.375H1.125C0.492188 0.375 0 0.902344 0 1.5V3.75C0 4.38281 0.492188 4.875 1.125 4.875H3.375C3.97266 4.875 4.5 4.38281 4.5 3.75V1.5C4.5 0.902344 3.97266 0.375 3.375 0.375ZM3.375 6H1.125C0.492188 6 0 6.52734 0 7.125V9.375C0 10.0078 0.492188 10.5 1.125 10.5H3.375C3.97266 10.5 4.5 10.0078 4.5 9.375V7.125C4.5 6.52734 3.97266 6 3.375 6ZM3.375 11.625H1.125C0.492188 11.625 0 12.1523 0 12.75V15C0 15.6328 0.492188 16.125 1.125 16.125H3.375C3.97266 16.125 4.5 15.6328 4.5 15V12.75C4.5 12.1523 3.97266 11.625 3.375 11.625ZM10.125 0.375H7.875C7.24219 0.375 6.75 0.902344 6.75 1.5V3.75C6.75 4.38281 7.24219 4.875 7.875 4.875H10.125C10.7227 4.875 11.25 4.38281 11.25 3.75V1.5C11.25 0.902344 10.7227 0.375 10.125 0.375ZM10.125 6H7.875C7.24219 6 6.75 6.52734 6.75 7.125V9.375C6.75 10.0078 7.24219 10.5 7.875 10.5H10.125C10.7227 10.5 11.25 10.0078 11.25 9.375V7.125C11.25 6.52734 10.7227 6 10.125 6ZM10.125 11.625H7.875C7.24219 11.625 6.75 12.1523 6.75 12.75V15C6.75 15.6328 7.24219 16.125 7.875 16.125H10.125C10.7227 16.125 11.25 15.6328 11.25 15V12.75C11.25 12.1523 10.7227 11.625 10.125 11.625Z" fill="#D5D5D5" />
                        </svg>
                        <div className="">Label</div>
                    </div>
                    <div ref={inputRef} className="p-2 bg-white rounded-sm cursor-move flex gap-2 items-center paigeBuilderInput" draggable="true">
                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.375 0.375H1.125C0.492188 0.375 0 0.902344 0 1.5V3.75C0 4.38281 0.492188 4.875 1.125 4.875H3.375C3.97266 4.875 4.5 4.38281 4.5 3.75V1.5C4.5 0.902344 3.97266 0.375 3.375 0.375ZM3.375 6H1.125C0.492188 6 0 6.52734 0 7.125V9.375C0 10.0078 0.492188 10.5 1.125 10.5H3.375C3.97266 10.5 4.5 10.0078 4.5 9.375V7.125C4.5 6.52734 3.97266 6 3.375 6ZM3.375 11.625H1.125C0.492188 11.625 0 12.1523 0 12.75V15C0 15.6328 0.492188 16.125 1.125 16.125H3.375C3.97266 16.125 4.5 15.6328 4.5 15V12.75C4.5 12.1523 3.97266 11.625 3.375 11.625ZM10.125 0.375H7.875C7.24219 0.375 6.75 0.902344 6.75 1.5V3.75C6.75 4.38281 7.24219 4.875 7.875 4.875H10.125C10.7227 4.875 11.25 4.38281 11.25 3.75V1.5C11.25 0.902344 10.7227 0.375 10.125 0.375ZM10.125 6H7.875C7.24219 6 6.75 6.52734 6.75 7.125V9.375C6.75 10.0078 7.24219 10.5 7.875 10.5H10.125C10.7227 10.5 11.25 10.0078 11.25 9.375V7.125C11.25 6.52734 10.7227 6 10.125 6ZM10.125 11.625H7.875C7.24219 11.625 6.75 12.1523 6.75 12.75V15C6.75 15.6328 7.24219 16.125 7.875 16.125H10.125C10.7227 16.125 11.25 15.6328 11.25 15V12.75C11.25 12.1523 10.7227 11.625 10.125 11.625Z" fill="#D5D5D5" />
                        </svg>
                        <div className="">Input</div>
                    </div>
                    <div ref={buttonRef} className="p-2 bg-white rounded-sm cursor-move flex gap-2 items-center paigeBuilderButton" draggable="true">
                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.375 0.375H1.125C0.492188 0.375 0 0.902344 0 1.5V3.75C0 4.38281 0.492188 4.875 1.125 4.875H3.375C3.97266 4.875 4.5 4.38281 4.5 3.75V1.5C4.5 0.902344 3.97266 0.375 3.375 0.375ZM3.375 6H1.125C0.492188 6 0 6.52734 0 7.125V9.375C0 10.0078 0.492188 10.5 1.125 10.5H3.375C3.97266 10.5 4.5 10.0078 4.5 9.375V7.125C4.5 6.52734 3.97266 6 3.375 6ZM3.375 11.625H1.125C0.492188 11.625 0 12.1523 0 12.75V15C0 15.6328 0.492188 16.125 1.125 16.125H3.375C3.97266 16.125 4.5 15.6328 4.5 15V12.75C4.5 12.1523 3.97266 11.625 3.375 11.625ZM10.125 0.375H7.875C7.24219 0.375 6.75 0.902344 6.75 1.5V3.75C6.75 4.38281 7.24219 4.875 7.875 4.875H10.125C10.7227 4.875 11.25 4.38281 11.25 3.75V1.5C11.25 0.902344 10.7227 0.375 10.125 0.375ZM10.125 6H7.875C7.24219 6 6.75 6.52734 6.75 7.125V9.375C6.75 10.0078 7.24219 10.5 7.875 10.5H10.125C10.7227 10.5 11.25 10.0078 11.25 9.375V7.125C11.25 6.52734 10.7227 6 10.125 6ZM10.125 11.625H7.875C7.24219 11.625 6.75 12.1523 6.75 12.75V15C6.75 15.6328 7.24219 16.125 7.875 16.125H10.125C10.7227 16.125 11.25 15.6328 11.25 15V12.75C11.25 12.1523 10.7227 11.625 10.125 11.625Z" fill="#D5D5D5" />
                        </svg>
                        <div className="">Button</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home