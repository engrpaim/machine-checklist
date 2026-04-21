import { useState, useEffect, use } from "react";
import { usePage, useForm, router } from "@inertiajs/react";

import MainLayout from "../Layouts/MainLayout";
import SelectorModels from "../Layouts/SelectorModels";
import CommonDetails from "../Components/CommonDetails"
import BarellingDetails from "../Components/BarellingDetails";
import TriBlockModal from "../Components/TriBlockModal";
import Loading from "../Components/Loading";
import MeasuringData from "../Components/MeasuringData";
import { emptyCount, handleKeyDown } from "../utils/UtilityFunctions";
import { all } from "axios";
import Chamfering from "../Components/Chamfering";
import PasswordModal from "../Components/PasswordModal";
import Cghl from "../Components/Cghl";
import CghMeasuring from "../Components/CghMeasuring";
import Histogram from "../Components/HistoGram";
export default function Measure() {
    /**
     *
     *
     * return machining sheet
     * Details Selector return components based on sheet
     *
     *
     * **/
    const { modelsList, flash, modal, current_lot, batches, existing, model , copy_batch } = usePage().props;
    console.log('Props', flash, modal, current_lot, existing, 'Models: ', model,'Details: ',copy_batch);
    const [modelState, setModelState] = useState(null);
    const [processState, setProcessState] = useState(null);
    const [measureButton, setMeasureButton] = useState(null);
    const [areaState, setAreaState] = useState(null);
    const [statusCheck, setStatusCheck] = useState(null);
    const [triModal, setTriModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allBatches, setAllBatches] = useState(false);
    const [processForm, setProcessForm] = useState(false);
    const [processFromCount, setProcessFromCount] = useState(null);
    const [arrayBank, setArrayBank] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [currentModel, setCurrentModel] = useState(false);
    const [editBatch, setEditBatch] = useState(false);
    const [passworModal, setPasswordModal] = useState(false);
    const [copyBatchDetails ,setCopyBatchDetails] = useState(false);
    const [histogram,setHistogram] = useState(false);

    //Notification
    const [Notification, setNotification] = useState(false);
    console.log('type chamfer: ', currentModel.chamfer_type);
    const alloweAble = {
        barelling: { preparing: 10},
        cghl:{preparing:11}
    }
    const toHide = ["prepared", "measured", "approved"];
    const buttonStatus = {
        prepared: 'Measure',
        measured: 'Approved',
        update: 'Edit',
    }
    const common = ['lot_number', 'date', 'shift', 'operator_name', 'checker', 'staff_engineer', 'process'];
    //preparation details
    const { data, setData, post, processing, errors, reset } = useForm({
        lot_number: '',
        date: '',
        shift: '',
        operator_name: '',
        checker: '',
        staff_engineer: '',
        process: '',
        page: 'measure'
    });
    /** Barelling Page **/
    //barelling details
    const { data: barellingDetails, setData: setBarellingDetails, reset: resetBarellingDetails } = useForm({
        datalist_id: '',
        datalist_lot_number: '',
        batch_number: '',
        total_batch_number: '',
        total_qty_lot: '',
        media_size: '',
        media_weight: '',
        coolant_level: '',
        styrene_powder: '',
        gc_powder: '',
        magnet_wt_pc_: '',
        chamfertype: '',
        model:'',
    });

    //timer
    const { data: timerDetails, setData: setTimerDetails, reset: resetTimerDetails } = useForm({
        timer_1: '',
        rotation_1: '',
        timer_2: '',
        rotation_2: '',
        timer_3: '',
        rotation_3: '',
        addition_timer_1: '',
        addition_rotation_1: '',
        addition_timer_2: '',
        addition_rotation_2: '',
        addition_timer_3: '',
        addition_rotation_3: '',
    });

    const { data: magnetPoints, setData: setMagnetPoints, reset: resetMagnetPoints } = useForm({
        magnet_1: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 },
        magnet_2: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 },
        magnet_3: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 },
        magnet_4: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 },
        magnet_5: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 },
        chamfer1: { machine: '', m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 },
        chamfer2: { machine: '', m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 }
    });

    /** CGHL Details **/
    const { data:cghlDetails , setData:setCghlDetails, reset: resetCghlDetails} = useForm({
        datalist_id: '',
        datalist_lot_number: '',
        model:'',
        batch_number:'',
        machine_number:'',
        upper_conveyor_speed:'',
        lower_conveyor_speed:'',
        carrier_speed:'',
        auto_cylinder_forward_speed:'',
        auto_cylinder_moving_distance:'',
        micrometer_serial_number:''
    });

    const {  data:cghlPoint , setData:setCghlPoint, reset: resetCghlPoint } =useForm({
        magnet_1: { p1_1:'' ,p1_2:'',p1_3:'',p2_1:'' ,p2_2:'',p2_3:'',p3_1:'' ,p3_2:'',p3_3:'',remarks:''},
        magnet_2: { p1_1:'' ,p1_2:'',p1_3:'',p2_1:'' ,p2_2:'',p2_3:'',p3_1:'' ,p3_2:'',p3_3:'',remarks:''},
        magnet_3: { p1_1:'' ,p1_2:'',p1_3:'',p2_1:'' ,p2_2:'',p2_3:'',p3_1:'' ,p3_2:'',p3_3:'',remarks:''},
    });

    const {data:cghTools ,setData:setCghTools, reset: resetCghTools}=useForm({
        form_gauge:'',
        form_n9:'',
        form_sorted:'',
        form_remarks:'',
        go_serial:'',
        go_validation:'',
        go_n9:'',
        go_sorted:''
    })

    const {data:perpenCghlThickness, setData:setPerpenCghlThickness , reset:resetPerpenCghlThickness}=useForm({
        1:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        2:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        3:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        4:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        5:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        6:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        7:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        8:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        9:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
        10:{pt1_top:'',pt2_top:'',pt3_top:'',pt4_top:'',pt5_top:'',pt1_bottom:'',pt2_bottom:'',pt3_bottom:'',pt4_bottom:'',pt5_bottom:''},
    });

    //useform for details
    //form for common details
    const handleCloseModal = () => {
        setTriModal(false);
    }

    const handleCheck = () => {
        setLoading(true);
        setStatusCheck(processState.process);
        setTriModal(false);
    }

    useEffect(() => {
        // const process = processState && processState.process ? processState.process : null
        // const model = modelState ? modelState : null
        console.log('hesslloxx', processState, modelState)

        if (processState && processState.process === '' && modelState || processState && processState.process !== '' && processState.value && !modelState ) {
            console.log('hessllo');
            router.visit("/machining-checklist/measure");
        }

    }, [processState, modelState])

    useEffect(() => {
        if (!model) return;
        setCurrentModel(model);
    }, [model]);

    //manage form data
    useEffect(() => {
        //manage dynamicdata @return all data
        console.log('Updating data!');

        const arrayBankNew = {

            barelling: {
                data: data,
                details: barellingDetails,
                time_setting: timerDetails,
                points: magnetPoints,
                set_data:setData,
                set_points:setMagnetPoints,
                set_time_setting:setTimerDetails,
                set_magnet:setMagnetPoints,
                set: setBarellingDetails,
                reset: resetBarellingDetails,
                resetPoints: resetMagnetPoints,
                subreset: resetTimerDetails
            },

            cghl: {
                data:data,
                details:cghlDetails,
                set:setCghlDetails,
                mass_pro:cghTools,
                points:cghlPoint,
                perpendicularity:perpenCghlThickness,
                set_perpen:setPerpenCghlThickness,
                set_data:setData,
                set_mass_pro:setCghTools,
                set_points:setCghlPoint,
                reset:resetCghlDetails,
                subreset:resetCghTools,
                resetPoints:resetCghlPoint
            },

        }

        setArrayBank(arrayBankNew)
        console.log('check if updating: ', cghlDetails);
    }, [barellingDetails, timerDetails, magnetPoints,cghlDetails,cghTools,cghlPoint,processState,perpenCghlThickness])



    const currenProcess = processState && processState.process ? processState.process : null;
    const payload = {
        page: {
            processing: data,
            measuring: arrayBank[currenProcess],
            model: modelState ?? null,
        }
    }

    const handleStore = async () => {
        setSubmittingForm(false);
        setLoading(true);
        // Create the payload
        try {
            console.log('Loaidng: ', loading);
            // Send to Laravel
            await router.post("/machining-checklist/measure/store", payload, {
                preserveState: true,
                preserveScroll: true,
            });

        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleCreate = async () => {
        setSubmittingForm(false);
        try {
            setLoading(true);
            // Send to Laravel
            await router.post("/machining-checklist/measure/batching", payload, {
                preserveState: true,
                preserveScroll: true,
            });

        } catch (err) {
            console.error("Error submitting form:", err);
        } finally {
            setTimeout(() => {
                setTriModal(false);

            }, 500);
        }

    }


    const handleBatch = async (batch_number) => {
        setSubmittingForm(false);
        processForm?.reset()
        processForm?.resetPoints()
        processForm?.subreset()
        setEditBatch(false);
        setStatusCheck(false);
        setLoading(true);
        setTriModal(false);

        console.log('get data', allBatches[batch_number]);
        const details = allBatches[batch_number]
        const datalist_id = details.datalist_id ?? null
        const process_batch = details.batch_number ?? null
        const process = processState.process ?? null

        if (!datalist_id || !process_batch || !process) return
        console.log('Selected: ', process_batch);
        const getPayLoad = {
            id: datalist_id,
            batch: process_batch,
            process: process,
            model: modelState ?? null,
        }

        try {
            await router.post("/machining-checklist/measure/get-details", getPayLoad, {
                preserveState: true,
                preserveScroll: true,
            });
        } catch (err) {
            console.error("Error submitting update:", err);
        }
    }

    const handleAutoSave = (key, parameter, value, e) => {
        setSubmittingForm(true);
        console.log('AutoSave');
        console.log('Testing', key, parameter, value, e);
        processForm[key][parameter] = value
        console.log(processForm);

        if (processState.process === 'barelling') {
            console.log('Current Champ', currentModel.chamfer_type, processForm);
            processForm[key]['chamfertype'] = currentModel.chamfer_type ?? null
        }
        const target = e.target;
        setTimeout(() => {
            const save = async () => {
                try {
                    await router.post('/machining-checklist/measure/autosave', { processForm }, {
                        preserveScroll: true,

                    })
                } catch (err) {
                    console.error(err)
                } finally {

                    setTimeout(() => {
                        setSubmittingForm(false);
                        const inputs = document.querySelectorAll("input");
                        const arr = Array.from(inputs);
                        let index = arr.indexOf(e.target);

                        let next = index + 1;


                        if (arr[next]) {
                            if (arr[next].disabled) {
                                arr[next].disabled = false;
                            }
                            arr[next].focus();
                            console.log('FOCUS AUTO:', next, arr[next].focus());
                        }

                    }, 1000)


                }
            }
            save();

        }, 2000);
    }

    const handleUpdateAllowed = async () => {
        console.log('Update post: ', processForm);

        setLoading(true);
        try {
            await router.post('/machining-checklist/measure/update', { processForm, payload }, {
                preserveScroll: true,
                preserveState: true
            });
        } catch (err) {
            console.log(err);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setEditBatch(false);

            }, 1000);
        }
    }

    const handleFinalize = async (status) => {
        setSubmittingForm(false);
        setEditBatch(false);
        console.log('Finalizing: ', status, processForm);
        setLoading(true);
        processForm["model"] = modelState;
        try {
            await router.post('/machining-checklist/measure/finalize', { processForm }, { preserveScroll: true, preserveState: true })
        } catch (err) {
            console.error(err);
        }
    }

    const handleProceed = async (status) => {
        setEditBatch(false);
        setSubmittingForm(false);
        console.log('Current Status: ', status);
        processForm["model"] = modelState;
        try {
            await router.post('/machining-checklist/measure/proceed', { processForm }, { preserveScroll: true, preserveState: true })
        } catch (err) {
            console.error(err);
        }
    }
    const handlePassword = (e) => {
        console.log(e)
        if (e !== 'Improvement') {
            setNotification({ theme: 'error-notif-text', message: 'Wrong password' });
            return setTimeout(() => {
                setNotification(false);
            }, 2000)
        }
        setPasswordModal(false);
        setEditBatch(true);
    }
    const goToNextInput = (e) => {
        setSubmittingForm(false);
        setTimeout(() => {
            const inputs = Array.from(
                document.querySelectorAll("input, select, textarea, button")
            ).filter(el => !el.disabled && el.tabIndex !== -1);
            const index = inputs.indexOf(e.target);
            inputs[index + 1]?.focus();
        }, 300);
    };
    const handleClear = () => {
        reset()
        processForm?.reset()
        processForm?.subreset()
        processForm?.resetPoints()
        setStatusCheck(false)
    }
    useEffect(() => {
        //return data for update
        setProcessFromCount(false)
        setTimeout(() => {
            setLoading(false)
        }, 500)
        if (!existing && !processState) return

        console.log('Update exist: ', existing);

        const convertedData = JSON.parse(existing);
        if (!convertedData) return
        console.log('Update exist: ', convertedData);
        Object.entries(convertedData).map(([key, value]) => {
            processForm?.set(key, value);
        })

        Object.entries(convertedData).filter(([key, values]) => common.includes(key)).map(([key, values]) => {
            setData(key, values);
        })

        if(processState.process === 'barelling'){
            //time
            convertedData.time_setting &&
            Object.entries(convertedData.time_setting).map(([key, values]) => {
                setTimerDetails(key, values);
            })

            //points
            convertedData.points &&
            Object.entries(convertedData.points).map(([key, values]) => {
                setMagnetPoints(key, values);
            })

        } else if(processState.process === 'cghl'){
             //time
            convertedData.mass_pro &&
            Object.entries(convertedData.mass_pro).map(([key, values]) => {
                setCghTools(key, values);
            })

            //points
            convertedData.points &&
            Object.entries(convertedData.points).map(([key, values]) => {
                setCghlPoint(key, values);
            })
            //perpendicularity
            convertedData.perpendicularity &&
            Object.entries(convertedData.perpendicularity).map(([key, values]) => {
                setPerpenCghlThickness(key, values);
            })
        }



    }, [existing])

    useEffect(() => {
        if (!batches) return
        const convertedBatches = JSON.parse(batches);
        setAllBatches(convertedBatches);
    }, [batches])

    useEffect(() => {
        if (!processState) return
        setData('process', processState.process)
        setProcessForm(arrayBank[processState.process])
    }, [processState, arrayBank])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
        if (flash.success) setStatusCheck(flash.success);
        return;
    }, [flash])

    useEffect(() => {
        if (!current_lot && !modal) return

        if (current_lot) {
            console.log('HHELLOO LOOE', current_lot)
            processForm?.reset()
            processForm?.subreset()
            processForm?.resetPoints()
            processForm?.set('batch_number', current_lot.batch_number)
            processForm?.set('datalist_id', current_lot.datalist_id ?? null);//'data_lot_number': current_lot.data_lot_number
            processForm?.set('datalist_lot_number', current_lot.datalist_lot_number ?? null);
            processForm?.set('model',modelState);
        }

        if(processState && processState.process === "barelling"){
            processForm?.set('chamfertype' , model.chamfer_type ?? null);
        }

        if (modal) {
            setTriModal(modal);
            setLoading(false);
        }

    }, [flash, current_lot, modal]);

    useEffect(() => {
        setProcessFromCount(false)

        if (!processForm) return;

        //set datalist_id
        let countCurrentEmpty = 0

        Object.entries(processForm).map(([key, value]) => {
            console.log('to count', key)
            if (typeof value === 'object' && key !== 'data') {
                const countEmpty = emptyCount(value);
                countCurrentEmpty += countEmpty
                console.log('Counted Empty: ', countCurrentEmpty, ' Current Empty: ', alloweAble[processState.process].preparing);
            }
        })

        countCurrentEmpty > alloweAble[processState.process].preparing ? setProcessFromCount(false) : setProcessFromCount(true)
    }, [processForm, existing]);

    console.log('DATA NOW:', cghlDetails);

    //Handle copy batch details @@handle

    useEffect(()=>{
        if(!copy_batch) return
        const copyDetails = JSON.parse(copy_batch);
        console.log('Copy Branch: ',arrayBank);
        Object.entries(copyDetails).map(([key,value])=>{
            if(key !== 'created_at' && key !== 'updated_at' && key !== 'shift' && key !== 'status') {

                if( typeof value === 'object'){
                    console.log('OBJECT: ',processForm?.[key]);
                    switch(key){
                        case 'time_setting':
                            Object.entries(value).map(([keyInner , valueInner])=>{
                                processForm?.set_time_setting(keyInner,valueInner)
                            })
                        default:
                            break;
                    }
                }else{
                    console.log('KEY EXIST: ' ,processForm?.details[key])

                    if(processForm?.data[key] !== undefined){
                        processForm?.set_data(key,value);
                    }

                    if(processForm?.details[key] !== undefined && key !== 'batch_number' && key !== 'status'){
                        console.log('cc: ',key , value)
                        processForm?.set(key,value)
                    }
                }
            }
        })
    },[copy_batch])

    const handlePartUpdate =async(data,identifier)=>{
        setLoading(true);
        const  process =  processState.process
        const currentData = {points:data,process:process,identifier:identifier,details:processForm?.details}
        try {
            console.log('Update Part: ', data);
            // Send to Laravel
            await router.post("/machining-checklist/measure/part-save",{data:currentData}, {
                preserveState: true,
                preserveScroll: true,
            });

        } catch (err) {
            console.error("Error submitting form:", err);
        }
    }

    return (
        <>
            {
                passworModal && <PasswordModal setPasswordModal={setPasswordModal} passworModal={passworModal} handlePassword={handlePassword} Notification={Notification} />
            }
            {
                triModal && <TriBlockModal
                    message={triModal}
                    handleCloseModal={handleCloseModal}
                    handleCheck={handleCheck}
                    handleCreate={handleCreate}
                    allBatches={allBatches}
                    handleBatch={handleBatch}
                />
            }
            {
                histogram && (<Histogram  title={histogram.title?modelState +histogram.title:null} timing={histogram.timing??null} setPerpenCghlThickness={setPerpenCghlThickness} perpenCghlThickness={perpenCghlThickness} point={histogram.point??5} hfp={histogram.hfp??'p'} setHistogram={setHistogram} handlePartUpdate={handlePartUpdate} handleKeyDown={handleKeyDown}/>)
            }
            {
                loading && <Loading />
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
                        modelState={modelState}
                        processState={processState}
                    />
                    {
                        modelState && processState &&
                        <div className="process-group">
                            <div className="process-result">
                                <h1 style={{ color: "currentColor" }}>{processState.process.toUpperCase()}</h1>
                                <p>{modelState}&nbsp;{processState.value}</p>
                            </div>
                            <div className="process-result2">
                                <h1 style={{ color: "currentColor" }}>PLANT AREA</h1>
                                <p>{areaState ?? 'Not registered! Contact PIC!'}</p>
                            </div>
                        </div>
                    }
                    {
                        measureButton && <CommonDetails
                            data={data}
                            setData={setData}
                            handleStore={handleStore}
                            processing={processing}
                            handleKeyDown={handleKeyDown}
                            loading={loading}
                            handleClear={handleClear}
                            statusCheck={statusCheck}
                            batch_number={barellingDetails && processForm.details &&processForm.details.batch_number ?processForm.details.batch_number: 'Finding.....'}

                        />
                    }
                </div>

                <div className="container-row">

                    {
                        statusCheck && modelState && processState && processState.process === 'barelling' && (processForm?.details["status"] === 'preparing' || processForm?.details["status"] === 'prepared' || !processForm?.details["status"]) ?
                            <BarellingDetails
                                handleKeyDown={handleKeyDown}
                                barellingDetails={barellingDetails}
                                setBarellingDetails={setBarellingDetails}
                                timerDetails={timerDetails}
                                setTimerDetails={setTimerDetails}
                                handleAutoSave={handleAutoSave}
                                barellProcessing={submittingForm}
                                chamfertype={currentModel.chamfer_type ?? null}
                                edit={editBatch}
                            />
                        :statusCheck &&  modelState && processState && processState.process === 'cghl' && (processForm?.details["status"] === 'preparing' || processForm?.details["status"] === 'prepared' || !processForm?.details["status"]) ?
                            <Cghl
                                handleKeyDown={handleKeyDown}
                                cghlDetails={cghlDetails}
                                setCghlDetails={setCghlDetails}
                                edit={editBatch}
                            />:null
                    }

                    {
                        statusCheck && modelState && processState && processState.process === 'barelling' && (processForm?.details["status"] === 'measuring' || processForm?.details["status"] === 'measured') ?
                            <div className="container-column">
                                <div>
                                    <h1>Measuring</h1>
                                </div>
                                <div className="inner-container-row">
                                  {
                                    currentModel && currentModel.chamfer_points  &&  currentModel.chamfer_points === 2  ?

                                        <Chamfering pointIdentifier={2} goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} chamfertype={barellingDetails.chamfertype ?? null} handleKeyDown={handleKeyDown} status={processForm.details["status"]} edit={editBatch} />
                                    :
                                        <Chamfering goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} chamfertype={barellingDetails.chamfertype ?? null} handleKeyDown={handleKeyDown} status={processForm.details["status"]} edit={editBatch} />
                                }
                                    <div>
                                        <h1></h1>
                                    </div>
                                </div>
                                <MeasuringData goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} status={processForm.details["status"]} edit={editBatch} />
                            </div>
                            : statusCheck && modelState && processState && processState.process === 'cghl' && (processForm?.details["status"] === 'measuring' || processForm?.details["status"] === 'measured') ?
                                    <CghMeasuring
                                        cghlDetails={cghlDetails}
                                        cghlPoint={cghlPoint}
                                        setCghlPoint={setCghlPoint}
                                        currentModel={currentModel}
                                        handleKeyDown={handleKeyDown}
                                        cghTools={cghTools}
                                        setCghTools={setCghTools}
                                        edit={editBatch}
                                        setHistogram={setHistogram}
                                        histogram={histogram}
                                        handlePartUpdate={handlePartUpdate}
                                        perpenCghlThickness={perpenCghlThickness}
                                    />
                            :null
                    }

                    {
                        statusCheck && modelState && processState && processState.process === 'barelling' && processForm?.details["status"] === 'approved' ?
                            <div className="container-column">
                                <div className="inner-container-row">
                                    <BarellingDetails
                                        handleKeyDown={handleKeyDown}
                                        barellingDetails={barellingDetails}
                                        setBarellingDetails={setBarellingDetails}
                                        timerDetails={timerDetails}
                                        setTimerDetails={setTimerDetails}
                                        handleAutoSave={handleAutoSave}
                                        barellProcessing={submittingForm}
                                        chamfertype={currentModel.chamfer_type ?? null}
                                        edit={editBatch}
                                    />
                                </div>
                                <div>
                                    <h1>Measuring</h1>
                                </div>
                                 {
                                    currentModel && currentModel.chamfer_points  &&  currentModel.chamfer_points === 2  ?

                                        <Chamfering pointIdentifier={2} goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} chamfertype={barellingDetails.chamfertype ?? null} handleKeyDown={handleKeyDown} status={processForm.details["status"]} edit={editBatch} />
                                    :
                                        <Chamfering goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} chamfertype={barellingDetails.chamfertype ?? null} handleKeyDown={handleKeyDown} status={processForm.details["status"]} edit={editBatch} />
                                }
                                <MeasuringData goToNextInput={goToNextInput} setMagnetPoints={setMagnetPoints} magnetPoints={magnetPoints} model={currentModel} process={processState.process} status={processForm.details["status"]} edit={editBatch} />
                            </div>
                            : statusCheck && modelState && processState && processState.process === 'cghl' && processForm?.details["status"] === 'approved' ?
                                <>
                                    <Cghl
                                        handleKeyDown={handleKeyDown}
                                        cghlDetails={cghlDetails}
                                        setCghlDetails={setCghlDetails}
                                        edit={editBatch}
                                    />

                                    <CghMeasuring
                                        cghlDetails={cghlDetails}
                                        cghlPoint={cghlPoint}
                                        setCghlPoint={setCghlPoint}
                                        currentModel={currentModel}
                                        handleKeyDown={handleKeyDown}
                                        cghTools={cghTools}
                                        setCghTools={setCghTools}
                                        edit={editBatch}
                                        setHistogram={setHistogram}
                                        histogram={histogram}
                                        handlePartUpdate={handlePartUpdate}
                                        perpenCghlThickness={perpenCghlThickness}
                                    />
                                </>
                            : null
                    }


                </div>
                {
                    processFromCount &&
                    <div className="container-row-status">
                        <div className="status-board">
                            <div>
                                <p>
                                    <strong style={{ fontWeight: 'bold' }}>Curent Status:&nbsp;</strong>
                                    &nbsp;
                                    {
                                        processForm && processForm.details["status"] ? processForm?.details["status"].toUpperCase() : 'PREPARING'
                                    }
                                    &nbsp;
                                </p>
                            </div>
                            <button className="status-btn" style={{ background: 'red' }} onClick={(e) => handleClear()}>Close</button>

                            {!toHide.includes(processForm?.details["status"]) ?
                                <button onClick={() => handleFinalize(processForm && processForm?.details["status"] ? processForm?.details["status"].toUpperCase() : 'PREPARING')} className="status-btn" >Finalize</button> :
                                <>
                                    {processForm?.details["status"] !== 'approved' ? <button className="status-btn" onClick={(e) => handleProceed(processForm?.details["status"])}>{processForm && processForm?.details["status"] ? buttonStatus[processForm?.details["status"]] : null}</button> : null}
                                    {
                                        editBatch ? <button className="status-btn" onClick={(e) => handleUpdateAllowed()}>Update</button> : <button className="status-btn" onClick={(e) => setPasswordModal(true)}>Edit</button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                }
            </section>
        </>
    )
}

Measure.layout = page => <MainLayout>{page}</MainLayout>
