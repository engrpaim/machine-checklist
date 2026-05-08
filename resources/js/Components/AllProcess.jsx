import { Link, router } from "@inertiajs/react"
import { useState } from "react"
import Loading from "./Loading"
export default function AllProcess({data}){
    console.log('All process: ',data)
    const [loading,setLoading] = useState(false);
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
    return(
        <div className="dashboard-container">
            {
                loading && <Loading/>
            }
            <div>
                <h1>All Records</h1>
                <p>This record is sorted from newest to oldest</p>
            </div>
            <div style={{ height: '30rem' }}>
                <div className="container-center"  >
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Lot Number</th>
                                <th>Shift</th>
                                <th>Process </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.data &&  Object.entries(data.data).map(([key,value])=>{
                                        return(
                                            <tr key={key} style={{ background: key % 2 === 0 ? '#E8F4FC':'#BFE1F8' }}>
                                                <td style={{ textAlign:'start' }}>{value.model}</td>
                                                <td>{value.lot_number}</td>
                                                <td>{value.shift}</td>
                                                <td >
                                                    {
                                                        value.preparing && Object.values(value.preparing).map((items)=>(<button className="process-btn" onClick={()=>handleGoToData(value.lot_number,items,value.id,value.model)}>{items}</button>))
                                                    }
                                                </td>
                                                 <td >
                                                    <div className="button-container">
                                                        {
                                                            value.preparing && Object.values(value.preparing).map((items)=>(<button className="delete-button" onClick={()=>handleDelete(value.id,items)}>delete&nbsp;{items}</button>))
                                                        }
                                                        <button className="delete-button" onClick={()=>handleDelete(value.id,'datalist')}>Delete All</button>
                                                    </div>
                                                </td>
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
