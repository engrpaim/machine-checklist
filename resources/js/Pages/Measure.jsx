import { useState , useEffect } from "react";
import { usePage ,useForm } from "@inertiajs/react";

import MainLayout from "../Layouts/MainLayout";
import SelectorModels from "../Layouts/SelectorModels";
import CommonDetails from "../Components/CommonDetails"
import BarellingDetails from "../Components/BarellingDetails";
import { emptyCount } from "../utils/UtilityFunctions";
export default function Measure(){
    /**
     * return machining sheet
     * Details Selector return components based on sheet
     * **/
    const {modelsList,flash} = usePage().props;
    console.log('falssjj' , flash);
    const [modelState, setModelState] = useState(null);
    const [processState , setProcessState]= useState(null);
    const [measureButton , setMeasureButton] = useState(null);
    const [areaState , setAreaState] = useState(null);
    const [statusCheck , setStatusCheck] =useState(null);
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
    const [countEmpty ,setCountEmpty] = useState(Object.keys(data).length);


    //useform for details
    //form for common details

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
    console.log(modelState , processState,measureButton,data);
    return(
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
                        measureButton && <CommonDetails data={data} setData={setData} handleStore={handleStore} processing={processing} />
                    }
            </div>
            <div>
                {
                    statusCheck && processState && processState.process === 'barelling' ?
                    <BarellingDetails/>:null
                }
            </div>
        </section>
    )
}

Measure.layout = page => <MainLayout>{page}</MainLayout>
