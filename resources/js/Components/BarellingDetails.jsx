import { useState } from "react";
import { InfoIcon , AddBoxIcon } from "../Icons/SVG"
export default function BarellingDetails({handleKeyDown,barellingDetail,setBarellingDetails,setTimerDetails ,timerDetails}){
    const firstPart = ['Total Batch/Lot' , 'Total Qty/Lot', 'Total Wt./Lot' ,'Media Size' ]
    const timeRotation = [1,2,3];
    console.log(barellingDetail,timerDetails);
    const [addButton , setAddButton] = useState(null);
    return(
        <>
            <div className="details-container-gray">
                <h1>Barelling Details</h1>
                <div className="details-container-inner">
                    <div className="details-part">
                        <div className="details-data">
                            <label>Batch Number:</label>
                            <input onChange={(e)=>setBarellingDetails('batch_number',e.target.value)} disabled={true}/>
                        </div>
                        <div className="details-data">
                            <label>Total Batch/Lot:</label>
                            <input onChange={(e)=>setBarellingDetails('total_batch_lot',e.target.value)}  onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                        <div className="details-data">
                            <label>Total Qty/Lot:</label>
                            <input onChange={(e)=>setBarellingDetails('total_qty_lot',e.target.value)}  onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Media Size:</label>
                            <input onChange={(e)=>setBarellingDetails('media_size',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                        <div className="details-data">
                            <label>Media Weight:</label>
                            <input onChange={(e)=>setBarellingDetails('media_weight',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                        <div className="details-data">
                            <label>Coolant Level:</label>
                            <input onChange={(e)=>setBarellingDetails('coolant_level',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Styrene Powder:</label>
                            <input onChange={(e)=>setBarellingDetails('sytrene_powder',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                        <div className="details-data">
                            <label>GC Powder:</label>
                            <input onChange={(e)=>setBarellingDetails('gc_powder',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                        <div className="details-data">
                            <label>Magnet wt/pc.:</label>
                            <input onChange={(e)=>setBarellingDetails('magnet_wt_pc_',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Chamfertype:</label>
                            <input onChange={(e)=>setBarellingDetails('chamfertype',e.target.value)}    onKeyDown={(e) => handleKeyDown(e)}/>
                        </div>
                    </div>
                </div>
                <div className="information">
                    <InfoIcon size={15}/>
                    <p><i>Automatic Saving feature.</i></p>
                </div>
            </div>
            <div className="details-container-sky">
                <h1>Barreling Time</h1>
                <div className="time-container">

                        {
                           timeRotation.map((number)=>
                           <>
                                <div className="timer-setting">
                                    <div className="timer-data">
                                        <h1>T{number}</h1>
                                    </div>
                                    <div className="timer-data">
                                        <label>Time:</label>
                                        <label>Rotation:</label>
                                    </div>
                                    <div className="timer-data">
                                        <input  onChange={(e)=>setTimerDetails('timer_'+number,e.target.value)}   onKeyDown={(e) => handleKeyDown(e)}/>
                                        <input  onChange={(e)=>setTimerDetails('rotation_'+number,e.target.value)}   onKeyDown={(e) => handleKeyDown(e)}/>
                                    </div>
                                    <div className="timer-data">
                                        <p></p>
                                        <p></p>
                                    </div>
                                    <div className="timer-data">
                                        {
                                            addButton === number  ?
                                            <>
                                                <input onChange={(e)=>setTimerDetails('addition_timer_'+number,e.target.value)}   onKeyDown={(e) => handleKeyDown(e)}/>
                                                <input onChange={(e)=>setTimerDetails('addition_rotation_'+number,e.target.value)}   onKeyDown={(e) => handleKeyDown(e)}/>
                                            </>:
                                            <button className="add-timer" onClick={(e)=>setAddButton(number)}><AddBoxIcon/></button>

                                        }
                                    </div>
                                </div>
                                <hr  style={{
                                        border: 'none',
                                        borderTop: '1px solid #ddd',
                                        width: '100%',
                                    }}/>
                           </>
                           )
                        }
                        <div className="cancel-container">
                            <button className="cancel-btn" onClick={(e)=>setAddButton(false)}>Cancel</button>
                        </div>

                </div>

                <div className="information">
                    <InfoIcon size={15}/>
                    <p><i>Automatic Saving feature.</i></p>
                </div>
            </div>
        </>

    )
}
