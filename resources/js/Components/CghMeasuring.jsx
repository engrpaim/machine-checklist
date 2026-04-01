export default function CghMeasuring({cghlDetails}){
    console.log('MEASURING CGH: ', cghlDetails);
    return(
        <>
            <div>
                <h1>{cghlDetails.model ?? '404 error'}&nbsp;CGH (L) DIMENSION MONITORING</h1>
            </div>
        </>
    )
}
