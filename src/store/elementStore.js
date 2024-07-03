import { create } from "zustand";

const useElementStore = create((set) => ({
    selectedElement: null,
    setSelectedElement: async(element) => set((state) => ({selectedElement: element})),
    resetSelectedElements: () => set({ selectedElement:null })
}));

export default  useElementStore;