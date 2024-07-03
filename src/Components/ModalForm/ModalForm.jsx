import React from 'react'
import useModalStore from '../../store/modalStore';

const ModalForm = ({
    onModalSubmit
}) => {

    const { setIsModalOpen, labelState, setLabelState, resetLabelState } = useModalStore((state) => ({
        setIsModalOpen: state.setIsModalOpen,
        labelState: state.labelState,
        setLabelState: state.setLabelState,
        resetLabelState: state.resetLabelState,
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onModalSubmit();
        resetLabelState();
    }

    return (
        <form onSubmit={handleSubmit} className='max-h-[100vh]'>
            <div className="flex justify-between items-center">
                <div>Edit {labelState.type==="div" ? "label" : labelState.type==="input" ? "Input" : "Button"}</div>
                <div className="" onClick={() => { setIsModalOpen(false) }}>X</div>
            </div>
            <div className="border-black border-t-[1px] w-full my-4"></div>
            <div className='flex flex-col gap-2 pb-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="LabelText">Text</label>
                    <input required={labelState.type==="input"?false : true} className='border-[##000000d9] border-[1px] py-2 pl-2 rounded-sm outline-none' type="text" id="LabelText" name="LabelText" value={labelState.title} onChange={(e)=>{setLabelState({title : e.target.value})}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="XCord">X</label>
                    <input required className='border-[##000000d9] border-[1px] py-2 pl-2 rounded-sm outline-none' type="number" id="XCord" name="XCord" value={labelState.xCord} onChange={(e)=>{setLabelState({xCord : e.target.value})}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="YCord">Y</label>
                    <input required className='border-[##000000d9] border-[1px] py-2 pl-2 rounded-sm outline-none' type="number" id="YCord" name="YCord" value={labelState.yCord} onChange={(e)=>{setLabelState({yCord : e.target.value})}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="FontSize">Font Size</label>
                    <input required className='border-[##000000d9] border-[1px] py-2 pl-2 rounded-sm outline-none' type="number" id="FontSize" name="FontSize" value={labelState.fontSize} onChange={(e)=>{setLabelState({fontSize : e.target.value})}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="FontWeight">Font Weight</label>
                    <input required className='border-[##000000d9] border-[1px] py-2 pl-2 rounded-sm outline-none' type="number" id="FontWeight" name="FontWeight" value={labelState.fontWeight} onChange={(e)=>{setLabelState({fontWeight : e.target.value})}} />
                </div>
                <div className="">
                    <button className='bg-[#0044C1] py-[10px] px-[20px] text-white'>Save Changes</button>
                </div>
            </div>
        </form>
    )
}

export default ModalForm