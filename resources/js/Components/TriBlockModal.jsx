
import workingImg from '@/Icons/working.png';
import { InfoIcon ,ArrowCircleIcon} from '../Icons/SVG';
import { useState } from 'react';
export default function TriBlockModal({message,handleCloseModal,handleCreate,allBatches,handleBatch}){
    const [update ,setUpdate] = useState(false);
    return(
        <div className="modal">
            <div className="modal-data-container">
                <div className='row-center'>
                    <InfoIcon color="black"/>
                    <h1>Attention</h1>
                </div>
                <div>
                    <p>{message}</p>
                </div>
                <div className='container-row-center border-modal-sky'>
                    <div className='btn-container-col'>
                        <div className='row-center'>
                            <button onClick={(e)=>handleCreate()} className='btn-grad'>CREATE BATCH</button>
                            <p>for this lot number?</p>
                        </div>
                        <div className='row-center'>
                            <p>or update batch number&nbsp;</p>
                            <div className='row-center'>
                                <select  className='modal-select' onChange={(e)=>setUpdate(e.target.value)}>
                                    <option></option>
                                    {
                                        Object.entries(allBatches).map((row)=>{
                                            const index = row[0]
                                            return <option value={index}>{row[1].batch_number}</option>
                                        })
                                    }
                                </select>
                                <button  className='btn-grad'  style={{ padding:'0.5rem' }} onClick={()=>handleBatch(update)} disabled={!(update || allBatches.length <= 0)}>UPDATE</button>
                            </div>
                        </div>
                        <div>
                            <button onClick={(e)=>handleCloseModal()} className='home-grad'>Back to page <ArrowCircleIcon width={25} height={25}/></button>
                        </div>
                    </div>
                    <div className='modal-info'>
                        <img src={workingImg} alt="Working cute" style={{ width:'8rem' ,height:'8rem' }}/>
                    </div>
                </div>

            </div>
        </div>
    );
}
