import '../../css/app.css'
import { useEffect, useState , useRef} from 'react';
import { useForm , router, usePage } from '@inertiajs/react';
import { CrossIcon } from '../Icons/SVG';
import Notification from '../Layouts/Notification';
import PasswordPrompts  from '../Layouts/PasswordPrompts';
import ModelSelector from '../Layouts/ModelSelector';
import InProcessDisplay from '../Layouts/InProcessDisplay';
import CGHL from '../Layouts/Cghl';
export default function Home({ message }) {

    const { flash ,LotData,detailsLot} = usePage().props;
    const sampleCheck =  [1, 2, 3, 4, 5];
    const timeRotation = [1,2,3];
    const modelDetails = {
        'maximum':1.7,
        'minimum':1.0,
        'target':1.5
    }

   const [notificationMessage, setNotificationMessage] = useState(null);
   const [modelIsExist , setModelIsExist] = useState(LotData);
   const [updateData ,setUpdate] = useState(null);

    useEffect(()=>{

        if (!flash) return;
        Object.entries(flash).map(([key, value]) => {

            setNotificationMessage({
                title: key,
                message: value,
            });

            setTimeout(()=>{
                setNotificationMessage(null);
            },2000);

        });

    },[flash]);

    const {data,setData,post, processing, errors} = useForm({
        model:'',
        process:'',
        lot:'',
        total_lot:'',
        qty_lot:'',
        wt_lot:'',
        media_size:'',
        media_weight:'',
        coolant:'',
        styrenre:'',
        gc_powder:'',
        magnet_wt:'',
        chamfer_type:'',
        date:'',
        shift:'',
        operator:'',
        checker:'',
        staff_eng:'',
    });

    const { data: StatusData, setData: setStatusData} = useForm({
        staffDetails: 0,
        barrellingProcss:0,
        pointsDetails:0,
        timerDetails:0
    });
    const { data: LotContainer , setData: setLotContainer}  = useForm({
        lot:'',
    });
    const {data: timerData , setData: setTimerData } = useForm({
        time_1:'',
        rotation_1:'',
        time_2:'',
        rotation_2:'',
        time_3:'',
        rotation_3:'',
        addtime_1:'',
        addrotation_1:'',
        addtime_2:'',
        addrotation_2:'',
        addtime_3:'',
        addrotation_3:'',
    });
    const {data:barrellingProcss ,setData:setBarrelingProcess} = useForm({
        machine_no:'',
        machinesample_1:'',
        machinesample_2:'',
        machinesample_3:'',
        machinesample_4:'',
        machinesample_5:''
    });
    const {data:passwordContainer ,setData:setPasswordContainer }=useForm({
        password:'',
        isCorrect:''
    });
    const {data: points_pt, setData: setPoints}=useForm(
    {
        pt1_1:'',
        pt1_2:'',
        pt1_3:'',
        pt1_4:'',
        pt1_5:'',
        pt2_1:'',
        pt2_2:'',
        pt2_3:'',
        pt2_4:'',
        pt2_5:'',
        pt3_1:'',
        pt3_2:'',
        pt3_3:'',
        pt3_4:'',
        pt3_5:'',
        pt4_1:'',
        pt4_2:'',
        pt4_3:'',
        pt4_4:'',
        pt4_5:'',
        pt5_1:'',
        pt5_2:'',
        pt5_3:'',
        pt5_4:'',
        pt5_5:'',
    });
    const exclude = ['model','date','process']
    const dataClear = ['data','points_pt','timerData','barrellingProcss'];
    const formState = { data,points_pt,timerData,barrellingProcss};
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    function clearAllInput(){
        dataClear.forEach((name) => {
        Object.entries(formState[name])
            .filter(([key]) => !exclude.includes(key))
            .forEach(([key]) => {

                if(name === 'data'){
                    setData(key, '');
                }else if(name === 'points_pt'){
                    setPoints(key,'');
                }else if(name === 'timerData'){
                    setTimerData(key,'');
                }else if(name === 'barrellingProcss'){
                    setBarrelingProcess(key,'');
                }
            });
        });
    }
    useEffect(()=>{
        setData('date',currentDate);
    },[currentDate]);
    useEffect(()=>{

        if(!LotContainer) return;

        if(!LotContainer.lot){
            setUpdate(null);
            clearAllInput();
        }
        setUpdate(null);
        const lostSend = LotContainer.lot;
        const handler = setTimeout(() => {
            router.post('/machining-checklist', {
                lot:lostSend,
                model:data.model
            },
            {
                preserveScroll:true,


            });
        }, 2000); // 2 seconds
        return () => clearTimeout(handler);


    },[LotContainer.lot]);
    useEffect(()=>{
        if(!data)return;

        const countEmptyData=  Object.values(data).filter(value => value === '').length;
        const countEmptyBarrelingProcess =  Object.values(barrellingProcss).filter(value => value === '').length;
        const countEmptyPoints =  Object.values(points_pt).filter(value => value === '').length;
        const countEmptyTimer=  Object.entries(timerData).reduce(
                                                    (acc, [key, value]) =>
                                                        value === '' && !key.includes("add") ? acc + 1 : acc,
                                                    0
                                                );
        setStatusData('staffDetails',countEmptyData);
        setStatusData('barrellingProcss' , countEmptyBarrelingProcess);
        setStatusData('pointsDetails' , countEmptyPoints);
        setStatusData('timerDetails' , countEmptyTimer);
    },[data , barrellingProcss,points_pt,timerData]);

    useEffect(()=>{
        if(!detailsLot)return;
        setModelIsExist(true);
    },[detailsLot]);
    // const [display , setDiFsplay] = useState(null);
    const handleClose=()=>{
       setData('lot','');
       setLotContainer('lot','');
       setPasswordContainer('password','');
       setPasswordContainer('isCorrect','');
       setModelIsExist(false);
       setUpdate(null);
      clearAllInput();


    }
    const handleSave = () => {
        // Convert Proxy objects to plain JS objects
        if(data && !data.lot) return;
        router.post('/machining-checklist', {
            ...data,
            pt_data:points_pt,
            barrelling:barrellingProcss,
            timer:timerData,

        },
        {
            preserveScroll:true,
            onSuccess:()=>clearAllInput()
        });


    };

    const handleUpdate=()=>{
        if(data && !data.lot) return;

        router.post('/machining-checklist/update', {
            ...data,
            pt_data:points_pt,
            barrelling:barrellingProcss,
            timer:timerData,

        },{preserveScroll:true,

              onSuccess: ()=>{
                    clearAllInput();
                    setUpdate(true);
                    setModelIsExist(false);
                    router.get('/machining-checklist', {}, { preserveScroll:true, preserveState:true });
                }
        });
    }

    const handlePICAllow =(keydown)=>{

        if(!keydown) return;

        setUpdate(false);
        setModelIsExist(true);
        if(passwordContainer.password === 'improvement'){
            setUpdate(true);
            setModelIsExist(false);
            setPasswordContainer('password','');

            dataClear.forEach((items)=>{
                Object.entries(formState[items]).map(([key,value])=>{
                    if(items === 'data'){
                        setData( key,detailsLot[key]);
                    }
                });
                });

                const convertToJSON = ["timer","barrelling","pt_data"];

                convertToJSON.forEach((toJson)=>{
                if(!detailsLot[toJson])return;
                Object.entries(detailsLot[toJson]).map(([key,value])=>{
                    if(toJson === 'timer'){
                        setTimerData(key,value);
                    }else if(toJson === 'barrelling'){
                        setBarrelingProcess(key,value);
                    }else if(toJson === 'pt_data'){
                        setPoints(key,value);
                    }
                })
            });

        }else{
            setPasswordContainer('isCorrect', 'Wrong password contact PIC!');
            setTimeout(()=>{
                setPasswordContainer('isCorrect','')
            },2000);
        }

    }

    const desicionStatus =(value)=>{
        //return status and color
        const numberConvert = Number(value);

        if (numberConvert > modelDetails.minimum && numberConvert < modelDetails.maximum){
            return { color:'green' , status:'GOOD'}
        }
         return { color:'red' , status:'NG'}
    }

    const goToNextInput = (pointData,name,data,e) => {

        if(pointData === 'point'){
            setPoints(name,data);
        }else if(pointData === 'sample'){
            setBarrelingProcess(name,data);
        }
        else{
            setData(name,data);
        }

        setTimeout(() => {
            const inputs = Array.from(
                    document.querySelectorAll("input, select, textarea, button")
                ).filter(el => !el.disabled && el.tabIndex !== -1);
            const index = inputs.indexOf(e.target);
            inputs[index + 1]?.focus();
        }, 300);

    };
    console.log('Status',StatusData);
    return (
        <div className='main-container'>
            {
                detailsLot && !updateData && modelIsExist &&

                <PasswordPrompts
                    detailsLot={detailsLot}
                    setPasswordContainer={setPasswordContainer}
                    handlePICAllow={handlePICAllow}
                    passwordContainer={passwordContainer}
                    handleClose={handleClose}

                />
            }
            {
                notificationMessage &&
                    <Notification message={notificationMessage.message} theme={notificationMessage.title}/>
            }
            <ModelSelector data={data} setData={setData}/>
            {
                    data && data.model  && data.process === 'inprocess' ?
                        <InProcessDisplay
                            data={data}
                            modelIsExist={modelIsExist}
                            setData={setData}
                            setLotContainer={setLotContainer}
                            currentDate={currentDate}
                            modelDetails={modelDetails}
                            timerData={timerData}
                            setTimerData={setTimerData}
                            goToNextInput={goToNextInput}
                            sampleCheck={sampleCheck}
                            StatusData={StatusData}
                            updateData={updateData}
                            handleUpdate={handleUpdate}
                            handleSave={handleSave}
                            timeRotation={timeRotation}
                            barrellingProcss={barrellingProcss}
                            points_pt ={points_pt}
                            desicionStatus ={desicionStatus}
                        />
                    :data && data.model && data.process === 'cghl' ?
                        <CGHL
                            data={data}
                        />:null
            }
        </div>
    );
}
