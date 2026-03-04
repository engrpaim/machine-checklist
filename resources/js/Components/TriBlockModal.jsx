
import workingImg from '@/Icons/working.png';
import { InfoIcon ,ArrowCircleIcon} from '../Icons/SVG';
export default function TriBlockModal({message,handleCloseModal,handleCheck}){
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
                            <button onClick={(e)=>handleCheck()} className='btn-grad'>CREATE BATCH</button>
                            <p>for this lot number?</p>
                        </div>
                        <div className='row-center'>
                            <p>or update&nbsp;</p>
                            <div className='row-center'>
                                <button className='batch-btn'>Batch 1</button>
                                <button className='batch-btn'>Batch 2</button>
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
