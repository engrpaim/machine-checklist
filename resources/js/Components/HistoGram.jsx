
/**
 *
 * @param {*} param0
 * @returns perpendicularity
 */

export default function Histogram({title,timing,array,set,point,hfp}){
    const max = 0.08
    const timingLower = timing.toLowerCase();
    const pointUse = point;
    const timingNumber = {
        'start' : [1,2,3],
        'middle' : [4,5,6],
        'end':[7,8,9],
        'all9': [1,2,3,4,5,6,7,8,9],
        'all10': [1,2,3,4,5,6,7,8,9,10],
        2:[1,2],
        5:[1,2,3,4,5]
    }
    return(
        <>
            <div className="modal"  style={{ fontSize:'12px' }}>
                <div className="modal-data-container">
                    <h1 style={{ fontSize:'15px' }}>{title}</h1>
                    <p style={{ fontSize:'14px' }}>{timing}</p>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>S/N</th>
                                    <th rowSpan={2}>Position</th>
                                    <th colSpan={pointUse}>Data</th>
                                    <th rowSpan={2} colSpan={2}>Perpendicularity</th>
                                    <th rowSpan={2}>Final Judgement</th>
                                </tr>
                                <tr>
                                    {
                                        timingNumber[pointUse].map(number=>{
                                            return(
                                                <th>Point&nbsp;{number}</th>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
