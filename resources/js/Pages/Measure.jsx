import { useState , useEffect } from "react";
import { usePage ,useForm } from "@inertiajs/react";

import MainLayout from "../Layouts/MainLayout";
import SelectorModels from "../Layouts/SelectorModels";
import CommonDetails from "../Components/CommonDetails"
import BarellingDetails from "../Components/BarellingDetails";
import TriBlockModal from "../Components/TriBlockModal";
import { emptyCount , handleKeyDown } from "../utils/UtilityFunctions";
export default function Measure(){
    /**
     * return machining sheet
     * Details Selector return components based on sheet
     * **/
    const {modelsList,flash,modal} = usePage().props;
    console.log('falssh: ' , flash,modal);
    const [modelState, setModelState] = useState(null);
    const [processState , setProcessState]= useState(null);
    const [measureButton , setMeasureButton] = useState(null);
    const [areaState , setAreaState] = useState(null);
    const [statusCheck , setStatusCheck] =useState(null);
    const [triModal,setTriModal] = useState(null);

    //preparation details
    const {data,setData,post, processing, errors} = useForm({
        lot_number:'',
        date:'',
        shift:'',
        operator_name:'',
        checker:'',
        staff_engineer:'',
        process:'',
        page:'measure'
    });

    //barelling details
    const {data:barellingDetails , setData:setBarellingDetails} = useForm({
        datalist_id :'',
        datalist_create_at:'',
        batch_number:'',
        total_batch_lot:'',
        total_qty_lot:'',
        media_size:'',
        media_weight:'',
        coolant_level:'',
        sytrene_powder:'',
        gc_powder:'',
        magnet_wt_pc_:'',
        chamfertype:'',
    });

    //timer
    const {data:timerDetails , setData:setTimerDetails} = useForm({
        timer_1:'',
        rotation_1:'',
        timer_2:'',
        rotation_2:'',
        timer_3:'',
        rotation_3:'',
        addition_timer_1:'',
        addition_rotation_1:'',
        addition_timer_2:'',
        addition_rotation_2:'',
        addition_timer_3:'',
        addition_rotation_3:'',
    });
    const [countEmpty ,setCountEmpty] = useState(Object.keys(data).length);


    //useform for details
    //form for common details
    const handleCloseModal=()=>{
        console.log('back to home');
        setTriModal(false);
    }

    const handleCheck =()=>{
        console.log('Set Status Check!');
        setStatusCheck(processState.process);
        setTriModal(false);
    }
    const handleStore = () => {
        const checkEmpty = emptyCount(data);
        console.log('clicked',checkEmpty,data);
        if(checkEmpty <= 0) post("/machining-checklist/measure/store")
    };


    useEffect(()=>{
        if(!processState) return
        setData('process',processState.process)
    },[processState])

    useEffect(()=>{

        if(flash.success) setStatusCheck(flash.success);
        return;

    },[flash])

    useEffect(()=>{
        if(!modal) return;
        setTriModal(modal);
    },[modal,flash])
    console.log(modelState , processState,measureButton,data);
    return(
        <>
            {
               triModal && <TriBlockModal message={triModal} handleCloseModal={handleCloseModal} handleCheck={handleCheck}/>
            }
            <section>

                <div>
                    <h1>Machining Checklist Data</h1>
                </div>
                {/*Details Selector*/}
                <div className="container-row">
                    <SelectorModels
                            model={modelsList}
                            setProcessState={setProcessState}
                            setModelState={setModelState}
                            setMeasureButton={setMeasureButton}
                            modelState = {modelState}
                            processState ={processState}
                        />
                        {
                            modelState && processState &&
                            <div className="process-group">
                                <div className="process-result">
                                    <h1 style={{ color:"currentColor" }}>{processState.process.toUpperCase()}</h1>
                                    <p>{modelState}&nbsp;{processState.value}</p>
                                </div>
                                <div className="process-result2">
                                    <h1 style={{ color:"currentColor" }}>PLANT AREA</h1>
                                    <p>{areaState ?? 'Not registered! Contact PIC!'}</p>
                                </div>
                            </div>
                        }
                        {
                            measureButton && <CommonDetails data={data} setData={setData} handleStore={handleStore} processing={processing} handleKeyDown={handleKeyDown} />
                        }
                </div>
                <div className="container-row">
                    {
                        statusCheck && modelState && processState && processState.process === 'barelling' ?
                        <BarellingDetails
                            handleKeyDown={handleKeyDown}
                            barellingDetail={barellingDetails}
                            setBarellingDetails={setBarellingDetails}
                            timerDetails={timerDetails}
                            setTimerDetails={setTimerDetails}
                        />:null
                    }
                </div>
            </section>
        </>
    )
}

Measure.layout = page => <MainLayout>{page}</MainLayout>
