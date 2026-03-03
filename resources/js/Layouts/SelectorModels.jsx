import {BuildingIcon} from '../Icons/SVG'
export default function SelectorModels({model ,setProcessState,  setModelState ,setMeasureButton , modelState ,processState}){

    const modelsParse = JSON.parse(model);
    const processValues = {
                            'barelling':'IN-PROCESS INSPECTION SHEET',
                            'cgh':'CGH (L) DIMENSION MONITORING',
                            'lapping':'LAPPING (T) DIMENSION MONITORING',
                            'slicing':'SLICING (W) MONITORING',
                          }

    return(
        <div className="process-selector">
            <div>
                <h1>Machining Checklist<BuildingIcon size={25}/></h1>
            </div>
            <div className="inside-container">
                <div className="inside-combined">
                    <div className="inside-spacebetween">
                        <label>Process:&nbsp;</label>
                        <select onChange={(e)=>setProcessState({ process:e.target.value, value: processValues[e.target.value]})}>
                            <option></option>
                            <option value="barelling" >IN-PROCESS INSPECTION SHEET</option>
                            <option value="cgh">CGH (L) DIMENSION MONITORING</option>
                            <option value="lapping">LAPPING (T) DIMENSION MONITORING</option>
                            <option value="slicing">SLICING (W) MONITORING</option>
                        </select>
                    </div>
                    <hr className="inside-hr"/>
                    <div className="inside-spacebetween">
                        <label>Model:&nbsp;</label>
                        <select onChange={(e)=>setModelState(e.target.value)}>
                            <option></option>
                            {
                                model && Object.entries(modelsParse).map(([key,value])=>{
                                    return <option key={key} value={key}>{key}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='inside-data-center'>
                <button className='inside-btn' onClick={(e)=>setMeasureButton('measure')} disabled={!(modelState && processState )} >Measure</button>
            </div>
        </div>

    )
}
