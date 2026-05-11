import MainLayout from "../Layouts/MainLayout"
import { useState, useRef , useEffect } from "react";
import { usePage, Link, useForm ,router } from "@inertiajs/react"
import {AddBoxIcon , CrossIcon } from "../Icons/SVG"
import Loading from "../Components/Loading"
import {handleKeyDown} from "../utils/UtilityFunctions"
import AdminUser from "../Layouts/AdminUser";
import Notification from "../Layouts/Notification"
import NotAdmin from "../Components/NotAdmin";
export default function Admin(){

    const {modelsList,flash,currentUpdate,userList,ip_client} = usePage().props
    // const [model ,setModel] = useState(modelsList.data?modelsList.data:null)

    useEffect(()=>{
        /**
         *
         * !!Important
         * Don't add other varibles this is only for notification
         *
         * **/
        if(!flash) return
        setNotification(flash)
        setTimeout(()=>{
            setNotification({})
        },3000)
    },[flash]);
    

    const [modal, setModal] = useState(false);
    const [laodingEffects, setLoadingEffects] = useState(false);
    const [preview,setPreview] = useState(false);
    const [notification , setNotification] = useState({});
    const [searchQuery ,setSearchQuery] = useState({});
    const [clientIp ,setClientIp] = useState(ip_client);
    const fileInputRef = useRef({});
    const timerRef = useRef(null);
    console.log('-------------------------Notficcation: ' ,notification);
    console.log('Model: ',modelsList,'Admin model: ',flash ,' Saved model: ' , currentUpdate,' User Details: ',userList ,'Client: ',ip_client);

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
        chamfer_barelling_max2: "",
        chamfer_barelling_min2: "",
        chamfer_barelling_target2: "",
        chamfer_type: "R- CHAMFER",
        chamfer_points:1,
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
        perpendicularity:'',
        page:'model',
        crud:'save',
        id:''

    })

    const { data:userDetails , setData:setUserDetails, post:postUser, processing:processingUser, errors:errorUser , reset:resetUserDetails} = useForm({
        id:null,
        first_name:'',
        last_name:'',
        id_number:'',
        machine_type:'Desktop',
        area:'',
        ip_1:'',
        ip_2:'',
        ip_3:'',
        ip_4:'',
        permission:'Normal',
        page:'user',
        crud:'save',
    })

    const handleClose =()=>{
        setModal(false);
        setPreview({})
        resetModelDetails();
        resetUserDetails();
    }

    const handleUpdateCurrent =(data , properties)=>{
            if(!data) properties?.({})
            Object.entries(data).map(([key,values])=>{
                 console.log(key,values);
                 properties?.(key,values)
            });
    }

    const submit = (e,table) => {
        e.preventDefault()
        console.log('Submitting',e);
        setLoadingEffects(true)
        console.log('fg' , modelDetails.model)
        switch(table){
            case 'model':
                if(!modelDetails.model) return setLoadingEffects(false)
                postModel("/machining-checklist/admin/models", {
                    preserveScroll: true,
                    onSuccess: () => {
                        setLoadingEffects(false)
                        resetModelDetails();
                        setModal(false);
                        setPreview({});
                    },
                })
                break;
            case 'user':
                postUser("/machining-checklist/admin/user", {
                    preserveScroll: true,
                    onSuccess: () => {
                        setLoadingEffects(false)
                        resetUserDetails();
                        setModal(false);
                        setPreview({});
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
        setPreview((prev)=>({
                        ...prev,
                        [`chamfer_point${point}_data`]:preview
                    }))

        setModeltails(`chamfer_point${point}_data`,file)

    }

    const handleDrop = (e, point) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);

         setPreview((prev)=>({
                        ...prev,
                        [`chamfer_point${point}_data`]:file
                    }))
        setModeltails(`chamfer_point${point}_data`,file)

    };

    //update model

    const handleUpdateModel =(index, page)=>{
        console.log('Updating Data: ',modelsList.data[index],page);

        switch(page){
            case 'model':
                if(!modelsList.data[index]) return
                const selectedModel = modelsList.data[index];
                Object.entries(modelDetails).map(([key,value])=>{
                    setModeltails(key,selectedModel[key]);

                    if(key.includes('chamfer_point') && !key.includes('chamfer_points') ){
                        setPreview((prev)=>({...prev ,[key ]: `/storage/${encodeURI(selectedModel[key])}`}) )
                    }
                })
                setModeltails('page','model');
                setModeltails('crud','save');
                setModal(page);
                break;
            case 'user':
                const data = userList.data[index]
                console.log('User Update: ' , data);
                if(!data) return
                console.log(data.ip_address.split("."));
                const ipSplit = data.ip_address.split(".")
                console.log(ipSplit[0]);
                Object.entries(userDetails).map(([key,value])=>{
                    console.log('User key: ',key);
                    setUserDetails(key,data[key]);
                });
                setUserDetails('ip_1',ipSplit[0]);
                setUserDetails('ip_2',ipSplit[1]);
                setUserDetails('ip_3',ipSplit[2]);
                setUserDetails('ip_4',ipSplit[3]);
                setUserDetails('page',page);
                setUserDetails('crud','save');
                setModal(page);
                break;
            default:
                break;
        }
    }

    function deleteManipulator(array,table){
        console.log('Delete: ',array);
         if(!array) return
                const selected = array
                const page = table
                router.post("/machining-checklist/admin/models", {
                    ...selected,
                    page: page,
                    crud: 'delete'
                },{
                    preserveScroll:true,
                    onSuccess: () => {
                        setLoadingEffects(false);
                    }
                });
    }

    const handleDelete=(e,index,table)=>{
        console.log('deleting: ', e ,index,table);
        console.log('---> ',modelsList.data[index]);
        setLoadingEffects(true);
        switch(table){
            case 'model':
               deleteManipulator(modelsList.data[index],table)
               break;
            case 'user':
               deleteManipulator(userList.data[index],table)
               break;
            default:
                setLoadingEffects(false);
                break;
        }
    }

    const handleSearch=(value,query_identify,model)=>{
        setSearchQuery({value:value,page:model});
        setTimeout(()=>{
            router.get('/machining-checklist/admin',{
                [query_identify]:value
            },{
                preserveScroll:true,
                preserveState:true
            })
        },[500])
    }
    console.log('File uploaded point : ',modelsList.data,' Preview: ',preview);
    return(
         <section>
            {
                notification && Object.entries(notification).filter(([_, value]) => value).map(([key,value]) =>{
                      return(
                            <Notification message={value} theme={`${key}-container`} />
                        );
                })
            }
            {
                laodingEffects && (<Loading />)
            }
            {
                modelsList.data  && modal === 'model' ?
                (
                    <AdminUser
                        modelDetails={modelDetails}
                        setModeltails={setModeltails}
                        handleKeyDown={handleKeyDown}
                        handleClose={handleClose}
                        preview={preview}
                        processingModel={processingModel}
                        fileInputRef={fileInputRef}
                        handleUpload={handleUpload}
                        submit={submit}
                        />
                ):
                modelsList.data  && modal === 'user' ?
                (
                    <div className="modal">
                        <form  className="form-data" onSubmit={
                                                                    (e)=> {

                                                                            submit(e,'user');

                                                                          }
                                                                  }>
                            <div className="details-container-white">
                                <div style={{ alignSelf:'flex-end'}}>
                                    <button className="close-btn" onClick={()=>handleClose()}><CrossIcon/></button>
                                </div>
                                <div>
                                    <p style={{ fontWeight:'bold' }}>User Manager</p>
                                </div>
                                <div className="modal-row">
                                    <div>
                                        <div className="modal-input">
                                            <label>First Name:</label>
                                            <input value={userDetails.first_name} onChange={(e)=>setUserDetails('first_name',e.target.value)} type="text" onKeyDown={(e)=>handleKeyDown(e)} />
                                        </div>
                                        <div className="modal-input">
                                            <label>Last Name:</label>
                                            <input value={userDetails.last_name} onChange={(e)=>setUserDetails('last_name',e.target.value)} type="text" onKeyDown={(e)=>handleKeyDown(e)} />

                                        </div>
                                        <div className="modal-input">
                                            <label>I.D Number:</label>
                                            <input type="number" value={userDetails.id_number} onChange={(e)=>setUserDetails('id_number',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="modal-input">
                                            <label>Machine Type:</label>
                                            <select value={userDetails.machine_type} onChange={(e)=>setUserDetails('machine_type' ,e.target.value)}>
                                                <option selected={true}>Desktop</option>
                                                <option>Laptop</option>
                                            </select>
                                        </div>
                                        <div className="modal-input">
                                            <label>Area:</label>
                                            <input  type="text" value={userDetails.area} onChange={(e)=>setUserDetails('area',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)} />
                                        </div>
                                        <div className="modal-input">
                                            <label>Permission:</label>
                                            <select value={userDetails.permission} onChange={(e)=>setUserDetails('permission',e.target.value)}>
                                                <option>Admin</option>
                                                <option>PIC</option>
                                                <option selected={true}>Normal</option>
                                            </select>
                                        </div>
                                        <div className="modal-input-ip">
                                            <label>I.P Address:</label>
                                            <input value={userDetails.ip_1} onChange={(e)=>setUserDetails('ip_1',e.target.value)} type="number" min="0" onKeyDown={(e)=>handleKeyDown(e)} />
                                            <h1>.</h1>
                                            <input value={userDetails.ip_2} onChange={(e)=>setUserDetails('ip_2',e.target.value)} type="number" min="0" onKeyDown={(e)=>handleKeyDown(e)} />
                                            <h1>.</h1>
                                            <input value={userDetails.ip_3} onChange={(e)=>setUserDetails('ip_3',e.target.value)} type="number" min="0" onKeyDown={(e)=>handleKeyDown(e)} />
                                            <h1>.</h1>
                                            <input value={userDetails.ip_4} onChange={(e)=>setUserDetails('ip_4',e.target.value)} type="number" min="0" onKeyDown={(e)=>handleKeyDown(e)} />
                                        </div>
                                    </div>
                                </div>
                                <button className="success-theme" style={{ alignSelf:'flex-end', marginTop:'1rem',padding:"0.5rem" }} type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                ):null
            }
            <div>
                <div>
                    <h1>Admin - Machining Checklist</h1>
                </div>
            </div>
            {
                clientIp ?
                <>
                    <div className="container-row">
                    {/*Admin Panel*/}
                    <div className="details-container-white-fit" style={{  display: "flex",flexDirection: "column"}}>
                        <div >
                            <h1>Model Manager</h1>
                        </div>
                        <div >
                            <p>Admin can Add, Update and Delete models.</p>
                        </div>
                        <div className="modal-between">
                            <div className="modal-row" style={{ margin:'1rem 0' }}>
                                <p>Add Model</p>
                                <button  className="add-btn" onClick={()=>setModal('model')}>
                                    <AddBoxIcon/>
                                </button>
                            </div>
                            <div className="modal-search">
                                <input placeholder="Search model" value={searchQuery && searchQuery.model === 'model' ? searchQuery.value:null} onChange={(e)=>handleSearch(e.target.value,'search_model','model')}/>
                            </div>
                        </div>
                        <div className="admin-container" >
                            <table className="admin-table" >
                                <thead>
                                    <tr>
                                        <th>Model</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    modelsList  && modelsList.data && Object.entries(modelsList.data).map(([key,value])=>{
                                            return(
                                                <tr key={key} className="model-td">
                                                    <td style={{ width:'15rem' }} >{value.model??'?'}</td>
                                                    <td style={{ width:'5rem' }}>
                                                        <div className="button-container">
                                                            <button className="udpate-button" onClick={()=>handleUpdateModel(key,'model')}>Update</button>
                                                            <button type="submit" className="delete-button" onClick={(e)=>handleDelete(e,key,'model')}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="page-container">
                            {modelsList.links.map((link, index) => (
                                <span key={index}>
                                {link.url ? (
                                    <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={link.active ? 'page-button-active' : 'page-button'}
                                    />
                                ) : (
                                    <span className='page-button'  dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                                </span>
                            ))}
                        </div>
                        <div className="container-center">
                            <p style={{ fontSize:"11px" }}><i>Page {modelsList.current_page} of {modelsList.last_page}</i></p>
                        </div>
                    </div>
                    {/*User*/}
                    <div className="details-container-white-fit">
                        <div >
                            <h1>User Manager</h1>
                        </div>
                        <div >
                            <p>Admin can Add, Update and User Details.</p>
                        </div>
                        <div className="modal-between">
                            <div className="modal-row" style={{ margin:'1rem 0' }}>
                                <p>Add User</p>
                                <button  className="add-btn" onClick={()=>setModal('user')}>
                                    <AddBoxIcon/>
                                </button>
                            </div>
                            <div className="modal-search">
                                <input placeholder="Search I.P or I.D" value={searchQuery && searchQuery.model === 'user' ? searchQuery.value:null} onChange={(e)=>handleSearch(e.target.value,'search_user','user')}/>
                            </div>
                        </div>
                        <div className="admin-container" >
                            <table className="admin-table" style={{  width:'fit-content' }}>
                                <thead>
                                    <tr>
                                        <th>I.P Address</th>
                                        <th>Name</th>
                                        <th>User Name</th>
                                        <th style={{ width:'10rem' }}>Type</th>
                                        <th>Area</th>
                                        <th>Permission</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userList && userList.data && Object.entries(userList.data).map(([key,value])=>{
                                            const first = value.first_name ?? 'x'
                                            const last = value.last_name ?? 'x'
                                            const fullname = last +" , "+ first
                                            return(
                                                <tr className="model-td">
                                                    <td style={{ width:'10rem' }}>{value.ip_address}</td>
                                                    <td style={{ width:'15rem' }}>{fullname}</td>
                                                    <td style={{ width:'10rem' }}>{value.user_name}</td>
                                                    <td>{value.machine_type}</td>
                                                    <td>{value.area}</td>
                                                    <td>{value.permission}</td>
                                                    <td>
                                                        <div className="button-container">
                                                            <button className="udpate-button" onClick={()=>handleUpdateModel(key,'user')}>Update</button>
                                                            <button className="delete-button" onClick={(e)=>handleDelete(e,key,'user')}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )

                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="page-container">
                            {userList && userList.links.map((link, index) => (
                                <span key={index}>
                                {link.url ? (
                                    <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={link.active ? 'page-button-active' : 'page-button'}
                                    />
                                ) : (
                                    <span className='page-button'  dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </>:<NotAdmin details={clientIp}/>
            }
         </section>


    )
}

Admin.layout = page => <MainLayout>{page}</MainLayout>
