export default function ModelSelector({data,setData}){
    return(
        <div className='machine-selector'>
            <h1>Machining Checklist</h1>
            <div className='selector-container'>
                <div className='selector-data'>
                    <label>Model:</label>
                    <select  value={data.model} onChange={(e)=>setData('model',e.target.value.toUpperCase())}>
                        <option value=""></option>
                        <option value="ROB0A70G">ROB0A70G</option>
                    </select>
                </div>
                <div className='selector-data'>
                    <label>Process:</label>
                    <select value={data.process} onChange={(e)=>setData('process',e.target.value)}>
                        <option value=""></option>
                        <option value="inprocess">IN-PROCESS INSPECTION SHEET</option>
                        <option value="cghl">CGH (L) DIMENSION MONITORING</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
