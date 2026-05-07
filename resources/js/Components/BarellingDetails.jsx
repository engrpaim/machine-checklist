import { useState, useEffect } from "react";
import { InfoIcon, AddBoxIcon, CrossIcon } from "../Icons/SVG"
export default function BarellingDetails({ handleKeyDown, barellingDetails, setBarellingDetails, setTimerDetails, timerDetails, handleAutoSave, barellProcessing, chamfertype, edit }) {
    const firstPart = ['Total Batch/Lot', 'Total Qty/Lot', 'Total Wt./Lot', 'Media Size']
    const timeRotation = [1, 2, 3];
    console.log('BARELLLIINNG PAGEE', barellingDetails, timerDetails,);

    const [addButton, setAddButton] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const toDisabled = ['prepared', 'measured', 'approved']
    useEffect(() => {
        const status = barellingDetails.status
        const allowed = toDisabled.includes(status) ? true : false
        setCurrentStatus(allowed);

    }, [barellingDetails]);
    return (
        <>
            <div className="details-container-gray">
                <h1>Barelling Details</h1>
                <div className="details-container-inner">
                    <div className="details-part">
                        <div className="details-data">
                            <label>Batch Number:</label>
                            <input value={barellingDetails.batch_number} disabled={true} />
                        </div>
                        <div className="details-data">
                            <label>Total Batch/Lot:</label>
                            <input type="number" onChange={(e) =>
                                setBarellingDetails('total_qty_lot', e.target.value)
                            } value={barellingDetails.total_qty_lot} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Total Qty/Batch:</label>
                            <input type="number"
                             onChange={(e) => setBarellingDetails('total_qty_batch', e.target.value)}
                             value={barellingDetails.total_qty_batch} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                          <div className="details-data">
                            <label>Total Wt/Batch:</label>
                            <input type="number" onChange={(e) => setBarellingDetails('total_wt_batch', e.target.value)} value={barellingDetails.total_wt_batch} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Media Size:</label>
                            <input onChange={(e) => setBarellingDetails('media_size', e.target.value)} value={barellingDetails.media_size} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Media Weight:</label>
                            <input onChange={(e) => setBarellingDetails('media_weight', e.target.value)} value={barellingDetails.media_weight} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Coolant Level:</label>
                            <input onChange={(e) =>
                                setBarellingDetails('coolant_level', e.target.value)
                            }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAutoSave('details', 'coolant_level', e.target.value, e)
                                    }
                                }}
                                value={barellingDetails.coolant_level} disabled={currentStatus && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Styrene Powder:</label>
                            <input onChange={(e) => setBarellingDetails('styrene_powder', e.target.value)} value={barellingDetails.styrene_powder} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>GC Powder:</label>
                            <input onChange={(e) => setBarellingDetails('gc_powder', e.target.value)} value={barellingDetails.gc_powder} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Magnet wt/pc.:</label>
                            <input onChange={(e) => setBarellingDetails('magnet_wt_pc_', e.target.value)} value={barellingDetails.magnet_wt_pc_} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                        </div>
                        <div className="details-data">
                            <label>Chamfertype:</label>
                            <input disabled={true} value={chamfertype ?chamfertype:barellingDetails.chamfertype?barellingDetails.chamfertype :null} />
                        </div>
                        <div className="details-data">
                            <label>Chamfer jig serial #:</label>
                            <input
                                    onChange={(e) => setBarellingDetails('chamfer_jig_serial', e.target.value)} value={barellingDetails.chamfer_jig_serial}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    disabled={(currentStatus || barellProcessing) && !(edit)}
                            />
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Contracer serial #:</label>
                           <input
                                    onChange={(e) => setBarellingDetails('contracer_serial', e.target.value)} value={barellingDetails.contracer_serial}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    disabled={(currentStatus || barellProcessing) && !(edit)}
                            />
                        </div>
                        <div className="details-data">
                            <label>Micrometer serial #:</label>
                            <input
                                    onChange={(e) => setBarellingDetails('micrometer_serial', e.target.value)} value={barellingDetails.micrometer_serial}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    disabled={(currentStatus || barellProcessing) && !(edit)}
                            />
                        </div>
                    </div>
                </div>
                <div className="information">
                    <InfoIcon size={15} />
                    <p><i>Automatic Saving feature.</i></p>
                </div>
            </div>
            <div className="details-container-sky">
                <h1>Barreling Time</h1>
                <div className="time-container">

                    {
                        timeRotation.map((number, index) =>
                            <>
                                <div key={index} className="timer-setting">
                                    <div className="timer-data">
                                        <h1>T{number}</h1>
                                    </div>
                                    <div className="timer-data">
                                        <label>Time:</label>
                                        <label>Rotation:</label>
                                    </div>
                                    <div className="timer-data">
                                        <input type="number" onChange={(e) => setTimerDetails('timer_' + number, e.target.value)} value={timerDetails['timer_' + number] ? timerDetails['timer_' + number] : ''} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                                        <input type="number" onChange={(e) =>
                                            setTimerDetails('rotation_' + number, e.target.value)

                                        } value={timerDetails['rotation_' + number] ? timerDetails['rotation_' + number] : ''} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                                    </div>
                                    <div className="timer-data">
                                        <p>{Number(timerDetails['timer_' + number]) + Number(timerDetails['addition_timer_' + number])}&nbsp;hr/s</p>
                                        <p>{Number(timerDetails['rotation_' + number]) + Number(timerDetails['addition_rotation_' + number])}&nbsp;RPM</p>
                                    </div>
                                    <div className="timer-data">
                                        {
                                            addButton === number ?
                                                <div className="addtion-container">
                                                    <div className="timer-data">
                                                        <input type="number" onChange={(e) => setTimerDetails('addition_timer_' + number, e.target.value)} value={timerDetails['addition_timer_' + number] ? timerDetails['addition_timer_' + number] : 0} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                                                        <input type="number" onChange={(e) =>
                                                            setTimerDetails('addition_rotation_' + number, e.target.value)} value={timerDetails['addition_rotation_' + number] ? timerDetails['addition_rotation_' + number] : 0} onKeyDown={(e) => handleKeyDown(e)} disabled={(currentStatus || barellProcessing) && !(edit)} />
                                                    </div>
                                                    <button className="close-btn" onClick={(e) => setAddButton(false)}><CrossIcon size={18} /></button>
                                                </div> :
                                                <button className="add-timer" onClick={(e) => setAddButton(number)}><AddBoxIcon /></button>

                                        }
                                    </div>
                                </div>
                                <hr style={{
                                    border: 'none',
                                    borderTop: '1px solid #ddd',
                                    width: '100%',
                                }} />
                            </>
                        )
                    }


                </div>

                <div className="information">
                    <InfoIcon size={15} />
                    <p><i>Automatic Saving feature.</i></p>
                </div>
            </div>
        </>

    )
}
