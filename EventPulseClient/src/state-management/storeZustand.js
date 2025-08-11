import {create} from 'zustand';
const useStore=create((set)=>({
    city:"Select City",
    setCity:(prop)=>set(()=>({city:prop}))
}))
export default useStore;