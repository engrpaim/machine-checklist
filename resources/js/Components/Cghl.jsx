import { useEffect,useState } from "react";
import { CrossIcon } from "../Icons/SVG";
export default function Cghl({cghlDetails,setCghlDetails,handleKeyDown,edit}){
    console.log('CGHL: ',cghlDetails);

    const [currentStatus , setCurrentStatus] = useState(false);
    const toDisabled = ['prepared', 'measured', 'approved'];
    useEffect(()=>{
        if(!cghlDetails) return;
        const status = cghlDetails.status
        const allowed = toDisabled.includes(status) ? true:false
        setCurrentStatus(allowed);
    },[cghlDetails]);


    return(
        <div className="details-container-gray">
            <h1>CGHL Details</h1>
            <div className="details-container-inner">
                <div className="details-part">
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Batch Number:</label>
                        <input disabled={true} value={cghlDetails.batch_number ?? null}/>
                    </div>
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Machine No:</label>
                        <input onChange={(e) => setCghlDetails('machine_number',e.target.value) } disabled={currentStatus && !(edit)} value={cghlDetails.machine_number} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Upper conveyor speed:</label>
                        <input onChange={(e)=> setCghlDetails('upper_conveyor_speed',e.target.value)} disabled={currentStatus && !(edit)} value={cghlDetails.upper_conveyor_speed}  onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                </div>
                <div className="details-part">
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Lower conveyor speed:</label>
                        <input onChange={(e)=>setCghlDetails('lower_conveyor_speed',e.target.value)} disabled={currentStatus && !(edit)} value={cghlDetails.lower_conveyor_speed} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Carrier Speed:</label>
                        <input onChange={(e)=>setCghlDetails('carrier_speed',e.target.value)} disabled={currentStatus && !(edit)}  value={cghlDetails.carrier_speed} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Auto Cylinder Forward Speed:</label>
                        <input onChange={(e)=>setCghlDetails('auto_cylinder_forward_speed',e.target.value)} disabled={currentStatus && !(edit)} value={cghlDetails.auto_cylinder_forward_speed} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                </div>
                <div className="details-part">
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label >Auto Cylinder Moving Distance:</label>
                        <input onChange={(e)=>setCghlDetails('auto_cylinder_moving_distance',e.target.value)} disabled={currentStatus && !(edit)} value={cghlDetails.auto_cylinder_moving_distance} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                    <div className="details-data" style={{ width:'24rem' }}>
                        <label>Micrometer Serial No:</label>
                        <input onChange={(e)=>setCghlDetails('micrometer_serial_number',e.target.value)} disabled={currentStatus && !(edit)} value={cghlDetails.micrometer_serial_number} onKeyDown={(e)=>handleKeyDown(e)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
