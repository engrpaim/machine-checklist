import MainLayout from "../Layouts/MainLayout"
import { useState, useRef } from "react";
import { usePage, Link, useForm } from "@inertiajs/react"
import {AddBoxIcon , CrossIcon } from "../Icons/SVG"
import Loading from "../Components/Loading"
import {handleKeyDown} from "../utils/UtilityFunctions"

export default function Admin(){
    const {modelsList,flash} = usePage().props
    const [model ,setModel] = useState(modelsList.data??null)
    const [modal, setModal] = useState(false);
    const [laodingEffects, setLoadingEffects] = useState(false);
    const [preview,setPreview] = useState(false);
    const fileInputRef = useRef({});
    console.log('Model: ',modelsList,'Admin model: ',model,flash);

    //Model Form
    const { data:modelDetails , setData:setModeltails, post:postModel, processing:processingModel, errors:errorModel , reset:resetModelDetails} = useForm({
        model:'',

        barelling_max: "",
        barelling_min: "",
        barelling_target: "",
        point:'',

        chamfer_barelling_max: "",
        chamfer_barelling_min: "",
        chamfer_barelling_target: "",
        chamfer_type: "",
        chamfer_points:"",
        chamfer_point1:'',
        chamfer_point2:'',
        chamfer_point1_data:'',
        chamfer_point2_data:'',

        cghl_max: "",
        cghl_min: "",
        cghl_target: "",
        cghl_points:"",

        lappingt_target: "",
        lappingt_max: "",
        lappingt_min: "",
        lapping_points:"",

        slicing_max: "",
        slicing_min: "",
        slicing_target: "",
        slicing_points:"",

        flatness_lapping: "",
        height_lapping: "",
        parallelism_lapping: "",

    })

    const handleClose =()=>{
        setModal(false);
        resetModelDetails();
    }
    const submit = (e,table) => {
        e.preventDefault()
        console.log('Submitting',e);
        setLoadingEffects(true)

        switch(table){
            case 'model':
                if(!modelDetails.model) return setLoadingEffects(false)
                postModel("/machining-checklist/admin/models", {
                    onSuccess: () => {
                        setLoadingEffects(false)
                    },
                })
                break;
            default:
                break;
        }

    }

    const handleUpload =(e,point)=>{
        const file = e.target.files[0];
        if(!file) return;

        console.log('File uploaded: ', e ,file,point);

        const preview  =  URL.createObjectURL(file);
        setModeltails(`chamfer_point${point}`,preview);
        setModeltails(`chamfer_point${point}_data`,file)

    }
    const handleDrop = (e, point) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);

        setModeltails(`chamfer_point${point}`,preview)
        setModeltails(`chamfer_point${point}_data`,file)

    };
    console.log('File uploaded point : ',modelDetails);
    return(
         <section>
            {
                laodingEffects && (<Loading />)
            }
            {
                model && modal &&
                (
                    <div className="modal">
                        <div className="details-container-white">
                            <div style={{ alignSelf:'flex-end'}}>
                               <button className="close-btn" onClick={()=>handleClose()}><CrossIcon/></button>
                            </div>
                            <div>
                                <h1>Create Model</h1>
                            </div>
                            <form onSubmit={(e)=>submit(e,'model')}   style={{ display: "flex", flexDirection: "column" ,gap:"1rem"}}>
                                <div>
                                    <div>
                                        <div>
                                            <div className="modal-input">
                                                <label>Model:</label>
                                                <input
                                                    value={modelDetails.model}
                                                    onChange={(e)=>setModeltails('model',e.target.value)}
                                                    onKeyDown={(e)=>handleKeyDown(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-row">
                                            <div>
                                                <div>
                                                    <h1>CGHL L</h1>
                                                </div>
                                                <div>
                                                    <div className="modal-input">
                                                        <label>CGHL target:</label>
                                                        <input
                                                            value={modelDetails.cghl_target}
                                                            onChange={(e)=>setModeltails('cghl_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>CGHL minimum:</label>
                                                        <input
                                                            value={modelDetails.cghl_min}
                                                            onChange={(e)=>setModeltails('cghl_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>CGHL maximum:</label>
                                                        <input
                                                            value={modelDetails.cghl_max}
                                                            onChange={(e)=>setModeltails('cghl_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Lapping T</h1>
                                                    <div className="modal-input">
                                                        <label>Lapping T target:</label>
                                                        <input
                                                            value={modelDetails.lappingt_target}
                                                            onChange={(e)=>setModeltails('lappingt_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Lapping T minimum:</label>
                                                        <input
                                                            value={modelDetails.lappingt_min}
                                                            onChange={(e)=>setModeltails('lappingt_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Lapping T maximum:</label>
                                                        <input
                                                            value={modelDetails.lappingt_max}
                                                            onChange={(e)=>setModeltails('lappingt_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Slicing Data*/}
                                            <div>
                                                <div>
                                                    <h1>Slicing</h1>
                                                </div>
                                                <div>
                                                    <div className="modal-input">
                                                        <label>Slicing target:</label>
                                                        <input
                                                            value={modelDetails.slicing_target}
                                                            onChange={(e)=>setModeltails('slicing_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Slicing minimum:</label>
                                                        <input
                                                            value={modelDetails.slicing_min}
                                                            onChange={(e)=>setModeltails('slicing_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Slicing maximum:</label>
                                                        <input
                                                            value={modelDetails.slicing_max}
                                                            onChange={(e)=>setModeltails('slicing_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Histogram</h1>
                                                    <div className="modal-input">
                                                        <label>Flatness:</label>
                                                        <input
                                                            value={modelDetails.flatness_lapping}
                                                            onChange={(e)=>setModeltails('flatness_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Height:</label>
                                                        <input
                                                            value={modelDetails.height_lapping}
                                                            onChange={(e)=>setModeltails('height_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Parallelism:</label>
                                                        <input
                                                            value={modelDetails.parallelism_lapping}
                                                            onChange={(e)=>setModeltails('parallelism_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Barelling Data*/}
                                            <div>
                                                <div>
                                                    <h1>Barelling</h1>
                                                </div>
                                                <div>
                                                    <div className="modal-input">
                                                        <label>Barelling target:</label>
                                                        <input
                                                            value={modelDetails.barelling_target}
                                                            onChange={(e)=>setModeltails('barelling_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling minimum:</label>
                                                        <input
                                                            value={modelDetails.barelling_min}
                                                            onChange={(e)=>setModeltails('barelling_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling maximum:</label>
                                                        <input
                                                            value={modelDetails.barelling_max}
                                                            onChange={(e)=>setModeltails('barelling_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling points:</label>
                                                        <input
                                                            value={modelDetails.point}
                                                            onChange={(e)=>setModeltails('point',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Chamfering</h1>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling target:</label>
                                                        <input
                                                            value={modelDetails.chamfer_barelling_target}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling minimum:</label>
                                                        <input
                                                            value={modelDetails.chamfer_barelling_min}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling maximum:</label>
                                                        <input
                                                            value={modelDetails.chamfer_barelling_max}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfer Type:</label>
                                                        <input
                                                            value={modelDetails.chamfer_type}
                                                            onChange={(e)=>setModeltails('chamfer_type',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfer Points:</label>
                                                        <input
                                                            value={modelDetails.chamfer_points}
                                                            onChange={(e)=>setModeltails('chamfer_points',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-row picture-container">
                                {
                                    modelDetails && modelDetails.chamfer_points ?
                                    Array.from({ length: modelDetails.chamfer_points }).map((_, i) => (
                                        <div className="upload-container-row">
                                            <div    className="drop-zone"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onClick={() => fileInputRef.current[`point${i+1}`].click()}
                                                    onDrop={(e) => handleDrop(e, i+1)}>
                                                <div>
                                                    <p style={{ fontWeight:'bold' , fontStyle:'italic' }}>Chamfering Point {i+1}</p>
                                                    <input id={`file-${i}`} ref={(el) => fileInputRef.current[`point${i+1}`] = el} type="file" accept="image/*" className="upload-input" onChange={(e)=>handleUpload(e,i+1)} idNanme="fileInput" hidden />
                                                </div>
                                                <div className="upload-container">
                                                    <div className="pictures-preview" style={{ width: "13rem" , height:"12rem"}}>
                                                        {
                                                            modelDetails[`chamfer_point${i+1}`] && <img src={modelDetails[`chamfer_point${i+1}`]} alt="preview" style={{ width: "13rem" , height:"12rem"}}/>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )): <div    className="drop-zone" style={{ display:'flex' , alignItems:'center' , justifyContent:'center' , width: "13rem" , height:"12rem" }}> No Photo needed</div>
                                }
                                </div>
                                <button className="success-theme" style={{ alignSelf:'flex-end' }} disabled={processingModel}>Submit</button>
                            </form>
                        </div>
                    </div>
                )
            }
            <div>
                <div>
                    <h1>Admin - Machining Checklist</h1>
                </div>
            </div>
            {/*Admin Panel*/}
            <div className="details-container-white-fit">
                <div >
                    <h1>Model Manager</h1>
                </div>
                <div >
                    <p>User can Add, Update and Delete models.</p>
                </div>
                <div className="modal-row" style={{ margin:'1rem 0' }}>
                    <p>Add Model</p>
                    <button  className="add-btn" onClick={()=>setModal(true)}><AddBoxIcon/></button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Process</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(model).map(([key,value])=>{
                                return(
                                    <tr key={key}>
                                        <td>{value.model??'?'}</td>
                                        <td>
                                            <button>Barelling</button>
                                            <button>(T~L) Perpendicularity</button>
                                            <button>Lapping (T)</button>
                                            <button>Slicing (W)</button>
                                        </td>
                                        <td>
                                            <button>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div>
                    {
                        modelsList && modelsList.links.map((link,index)=>(
                            <span key={index}>
                                {
                                    link.url && index!== 0 && index !== modelsList.data.length -1  && (
                                                    <Link
                                                        href={link.url}
                                                        className={link.active ? 'font-bold' : ''}>
                                                        {index}
                                                    </Link>
                                                )
                                }
                            </span>
                        ))
                    }
                </div>
            </div>
         </section>


    )
}

Admin.layout = page => <MainLayout>{page}</MainLayout>
