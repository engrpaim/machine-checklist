import { Link, router ,useForm,usePage } from "@inertiajs/react"
import { useState } from "react"
import Loading from "./Loading"
import { SearchIcon } from "../Icons/SVG"
export default function AllProcess({data , clientIp , model}){
    console.log('All process: ',data,' MODEL:',model)
    const [loading,setLoading] = useState(false);
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1]);

    //url paramas inpagination
    const startDate = params.get("start_date");
    const endDate = params.get("end_date");
    const modelUrl = params.get("model");
    const lotUrl = params.get("lot_number");

    const handleGoToData=async(lot,process, id,model)=>{
        setLoading(true);
        if(!lot || !process || !id || !model) return
        console.log(lot,process);
        try{
            await router.post('/machining-checklist/home/goto',
                {
                    lot_number:lot,
                    process:process,
                    id:id,
                    model:model
                },
                {
                    preserveScroll:true,
                    onSuccess:()=>{
                        setLoading(false);
                    }
                }
            );
        }catch(err){
            console.log('Error in process',err);
        }finally{

        }

    }
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate()-1);
    const yesterday =  yesterdayDate.toISOString().split("T")[0];
    
     const { data:filterDetails , setData:setFilterDetails, post:postFilter, processing:processingFilter, errors:errorFilter , reset:resetFilterDetails} =useForm({
        model:modelUrl?modelUrl:'',
        start_date:startDate?startDate:'',
        end_date:endDate?endDate:'',
        lot_number:lotUrl?lotUrl:'',
        table:lotUrl?lotUrl:'',
    })

    const handleDelete =(id,page)=>{
        console.log('Lot number: ', id,page);
        router.post('/machining-checklist/home/delete',
                {
                    id:id,
                    page:page
                },
                {
                    preserveScroll:true
                })
    }

    

    const handleFilterSearch =()=>{
        console.log('Filter Search: ', filterDetails);
        router.get('/machining-checklist/home',{data:filterDetails})
    }
    const submit=async(e,process)=>{
        console.log('Submitting: ' , process)
        e.preventDefault()
        switch(process){
            case "filter":
                try{
                    await router.get('/machining-checklist/home/',filterDetails,
                    {
                        preserveScroll:true,
                        preserveState:true,
                        onSuccess:()=>{
                            
                        }
                    });
                }catch(err){
                    console.log(err)
                }
               
                break;
            default:
                break;

        }

    }
    const formatDate = (dateString) => {
  return dateString ? dateString.split('T')[0] : '';
};
    return(
        <div className="dashboard-container">
            {
                loading && <Loading/>
            }
            <div>
                <h1>All Records</h1>
                <p>This record is sorted from newest to oldest</p>
            </div>
            <div >
                <form className="filter-container" onSubmit={(e)=>{
                                        
                                        

                                        submit(e,'filter')
                                        }}>
                    <p>Filter</p>
                    <SearchIcon/>
                    <p>Start</p><input type="date" onChange={(e)=>setFilterDetails('start_date',e.target.value)} value={filterDetails.start_date}/>
                    <p>End</p><input type="date" onChange={(e)=>setFilterDetails('end_date',e.target.value)} value={filterDetails.end_date} />
                    <p>Lot Number</p><input type="text" onChange={(e)=>setFilterDetails('lot_number',e.target.value)}/>
                    <p>Model</p><select onChange={(e)=>setFilterDetails('model',e.target.value)}   value={filterDetails.model}>
                            <option  selected={true}></option>
                        {
                            model.map((models)=>{
                                return(<option>{models}</option>)
                            })
                        }
                    </select>
                    <button type="submit" onClick={(e)=>setFilterDetails('table','datalist')}>Search</button>
                </form>
            </div>
            <div >
                <div className="dashboard-table-container"  >
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th style={{ width:'9rem' }}>Model</th>
                                <th style={{ width:'9rem' }}>Lot Number</th>
                                <th>Shift</th>
                                <th>Shift Date</th>
                                <th  style={{ width:'16rem' }}>Process </th>
                                {
                                    clientIp &&<th>Action</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.data &&  Object.entries(data.data).map(([key,value])=>{
                                        return(
                                            <tr key={key} style={{ background: key % 2 === 0 ? '#E8F4FC':'#BFE1F8' }}>
                                                <td style={{ textAlign:'start'  }}>{value.model}</td>
                                                <td>{value.lot_number}</td>
                                                <td>{value.shift}</td>
                                                <td>{value.created_at.split("T")[0]}</td>
                                                <td >
                                                    {
                                                        value.preparing && Object.values(value.preparing).map((items)=>(<button className="process-btn" onClick={()=>handleGoToData(value.lot_number,items,value.id,value.model)}>{items}</button>))
                                                    }
                                                </td>
                                                {
                                                    clientIp &&
                                                    <td >
                                                        <div className="button-container">
                                                            {
                                                                value.preparing && Object.values(value.preparing).map((items)=>(<button className="delete-button" onClick={()=>handleDelete(value.id,items)}>delete&nbsp;{items}</button>))
                                                            }
                                                            <button className="delete-button" onClick={()=>handleDelete(value.id,'datalist')}>Delete All</button>
                                                        </div>
                                                    </td>
                                                }
                                                 
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="page-container">
                        {data && data.links.map((link, index) => (
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
    )
}
