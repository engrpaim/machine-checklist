
/**
 *
 * @param {*} param0
 * @returns perpendicularity
 */

export default function Histogram({title,timing,perpenCghlThickness,setPerpenCghlThickness,point,hfp = 'hfp',setHistogram,handlePartUpdate, handleKeyDown , isDisabled,maxperpen}){
    console.log('Histogram perpenCghlThickness: ',perpenCghlThickness,setPerpenCghlThickness);
    const max = maxperpen
    const timingLower = timing.toLowerCase();
    const pointUse = point;
    const hfpCode = {
            h:'Height',
            f:'Flatness',
            p:'Perpendicularity'
    }
    const useCode= hfp.split("");
    const timingNumber = {
        'start' : [1,2,3],
        'middle' : [4,5,6],
        'end':[7,8,9],
        'all9': [1,2,3,4,5,6,7,8,9],
        'all10': [1,2,3,4,5,6,7,8,9,10],
        2:[1,2],
        5:[1,2,3,4,5]
    }

    const themeSelector =(judgement)=>{
        switch(judgement){
            case "ACCEPT":
                return 'success-theme'
            case "FOR ADJUST":
                return 'adjust-theme'
            case "REJECT":
                return 'error-theme'
            case "STOP MAKE ADJUSTMENT":
                return 'error-theme'
            default:
                break;
        }
    }
    const perpenView =(main)=>{
        let top = -1
        let bottom = -1
        let value = -1

        timingNumber[pointUse].map(numberOfPoints=>{
            console.log('top: ',numberOfPoints,top , Number(perpenCghlThickness[main][`pt${numberOfPoints}_bottom`]),top < Number(perpenCghlThickness[main][`pt${numberOfPoints}_bottom`]))
            top = top < Number(perpenCghlThickness[main][`pt${numberOfPoints}_top`]) ? Number(perpenCghlThickness[main][`pt${numberOfPoints}_top`]):top
            bottom = bottom < Number(perpenCghlThickness[main][`pt${numberOfPoints}_bottom`]) ? Number(perpenCghlThickness[main][`pt${numberOfPoints}_bottom`]):bottom

            top !== -1 && bottom !== -1 ? value = top > bottom ? top:bottom:value = -1
        })

        const judgementPiece = value !== 0 && value > max - 0.01 && value <= max? 'FOR ADJUST':value > max ?'REJECT':value !== 0 &&(top > -1 || bottom > -1)?'ACCEPT':null
        const final = value !== 0 && value > max - 0.01  ?'STOP MAKE ADJUSTMENT':value !== 0 &&(top > -1 || bottom > -1)?'ACCEPT':null

        return(
            <>
                <td className={themeSelector(judgementPiece)} rowSpan={2}>{ value !== -1 ?value:null }</td>
                <td style={{ width:'7rem' }} rowSpan={2} className={themeSelector(judgementPiece)}>{judgementPiece}</td>
                <td style={{ width:'10rem' }} rowSpan={2} className={themeSelector(final)}>{final}</td>
            </>
        )
    }
    console.log('Histograaaam: ',useCode);
    return(
        <>
            <div className="modal"  style={{ fontSize:'12px' }}>
                <div className="modal-data-container">
                    <h1 style={{ fontSize:'15px' }}>{title}</h1>
                    <p style={{ fontSize:'14px' }}>{timing}</p>
                    <div>
                        <table className="measuring-table" style={{ padding:'1rem' }}>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>S/N</th>
                                    <th rowSpan={2}>Position</th>
                                    <th colSpan={pointUse}>Data</th>
                                    {
                                        useCode.map(code=><th  colSpan={2}>{hfpCode[code]}</th>)
                                    }
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
                                    {
                                        useCode.map(code=>
                                            <>
                                                <th >Value</th>
                                                <th >Judgement</th>
                                            </>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    timingNumber[timingLower].map(main=>{

                                        return(
                                        <>
                                            <tr>
                                                <td rowSpan={2} >{main}</td>
                                                <td  style={{background:'#FFF085' ,padding:'0.6rem'}}>Top</td>
                                                {
                                                    timingNumber[pointUse].map((number)=>
                                                        <td style={{background:'#FFF085'}}  key={`pt${number}_top`}>
                                                            <input
                                                                disabled={isDisabled}
                                                                value={perpenCghlThickness[main][`pt${number}_top`] ? perpenCghlThickness[main][`pt${number}_top`]:''}
                                                                id={`pt${number}_top`}
                                                                type="number"
                                                                onKeyDown={(e)=>handleKeyDown(e)}
                                                                onChange={(e)=>{
                                                                    setPerpenCghlThickness(prev => ({
                                                                            ...prev,
                                                                            [main]: {
                                                                            ...prev[main],
                                                                            [`pt${number}_top`]: e.target.value
                                                                            }
                                                                    }));
                                                                }}

                                                            />
                                                        </td>
                                                    )
                                                }
                                                {
                                                    useCode.map(code=>{
                                                        console.log('Code Histogram:' , code)


                                                        switch(code){
                                                            case "p":
                                                               return perpenView(main)
                                                            default:
                                                                break;
                                                        }


                                                    })
                                                }

                                            </tr>
                                            <tr>
                                                <td style={{background:'#B9F7FE' ,padding:'0.6rem'}}>Bottom</td>
                                                {
                                                    timingNumber[pointUse].map(number=><td style={{background:'#B9F7FE'}} key={`pt${number}_bottom`}><input
                                                        disabled={isDisabled}
                                                        onKeyDown={(e)=>handleKeyDown(e)}
                                                        id={`pt${number}_bottom`}
                                                        value={perpenCghlThickness[main][`pt${number}_bottom`] ? perpenCghlThickness[main][`pt${number}_bottom`]:''}
                                                        type="number"
                                                        onChange={(e)=>{
                                                                setPerpenCghlThickness(prev => ({
                                                                        ...prev,
                                                                        [main]: {
                                                                        ...prev[main],
                                                                        [`pt${number}_bottom`]: e.target.value
                                                                        }
                                                                    }));
                                                        }}/></td>)
                                                }

                                            </tr>
                                        </>

                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="container-row" style={{ gap:'1rem' }}>
                        <button className="save-btn" onClick={(e)=>handlePartUpdate({perpendicularity:perpenCghlThickness})} disabled={isDisabled}>Save</button>
                        <button onClick={()=>setHistogram(false)} className="cancel2-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}
