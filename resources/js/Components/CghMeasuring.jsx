import { useState ,useEffect} from "react";
export default function CghMeasuring({cghlDetails,cghlPoint ,setCghlPoint,currentModel,handleKeyDown}){
    console.log('MEASURING CGH: ', cghlDetails,cghlPoint);
    /**
     *
     * Excel Based formula
     * TOL = MAX - MIN
     * STEP (Bin width) = TOL ÷ 10
     *
     *
     */
    const numberThree = [1,2,3]
    const title = [
        'Start' , 'Middle','End'
    ]
    const judgement = {};
    const spcAverage = [];
    const SPCControlls = {};
    const [model,setModel] = useState(false);

    useEffect(()=>{
        if(!currentModel) return
        setModel(currentModel);
    },[currentModel])

    const refereceValues=(u=0)=>{
        const currentCell = u
        const values = {
            AA90:currentModel.cghl_target - 0.001,
            AA87:currentModel.cghl_min,
            AA94:currentModel.cghl_max,
            AA95:currentCell+0.001,
            AA91:currentModel.cghl_max - 0.005,
            AA96:(currentModel.cghl_max - 0.005) - 0.001,
            OK_DIM_MIN:currentModel.cghl_target,
            OK_DIM_MAX:currentCell - 0.001
        }
        return values
    }
    const resultJudgementPoint=(point)=>{
        //return judgement status
        const refValueNew = refereceValues()
        // currentMin3points  < refValues.AA87 || currentMax3points > refValues.AA94 ? 'REJECT':currentMin3points < reultAA95.AA95 || currentMax3points > refValues.AA96?'FOR ADJUSTMENT':'ACCEPT'

       // return  point > refValueNew.AA90 && point < refValueNew.AA91? 'ACCEPT' :point >= refValueNew.AA87 && point <= refValueNew.AA94 ?'FOR ADJUSTMENT' :point ? 'REJECT':null
      if(!point || point === 0) return
       return  point  < refValueNew.AA87 || point > refValueNew.AA94 ? 'REJECT':point < refValueNew.AA95 || point > refValueNew.AA96?'FOR ADJUSTMENT':'ACCEPT'
    }


    const resultStatusJudgement=()=>{
        const max = currentModel.cghl_max
        const min = currentModel.cghl_min

        const TOL = max - min
        const STEP = Number((TOL/10) - 0.001.toFixed(3))
        console.log('Tolerance: ',TOL,'STEP: ',STEP);
        const range = []

        let currentStart = Number(min.toFixed(3))

        for(let i=0 ;i < 10;i++){
            const currentEnd = currentStart + STEP
            const End = Number(currentEnd.toFixed(3))
            console.log(currentStart ," --- " ,End);
            const newStart = End + 0.001

            range.push( i === 9 ? max:End)
            currentStart = Number(newStart.toFixed(3))
        }

        return range
    }

    const resultTheme =(value)=>{
        //return theme color
        console.log( 'hello' ,value);
        switch(value){
            case "GOOD":
                return 'success-theme'
                break;
            case "ACCEPT":
                return 'success-theme'
                break;
            case "FOR ADJUSTMENT":
                return 'adjust-theme'
                break;
            case "REJECT":
                return 'error-theme'
                break;
            default:
                return null
                break;
        }

    }
        numberThree.map(magnetNumber =>{
            numberThree.map(items =>{
                console.log('CGH Model: ',currentModel);
                const currentMagnet = cghlPoint[`magnet_`+magnetNumber];


                const point1 = Number(currentMagnet[`p${items}_1`]);
                const point2 = Number(currentMagnet[`p${items}_2`]);
                const point3 = Number(currentMagnet[`p${items}_3`]);




                let currentMax3points = point1 >= point2 && point1 >= point3? point1:point1 <= point2 && point2 >= point3? point2:point3;
                let currentMin3points = point1 <= point2 && point1 <= point3? point1:point2 <= point1 && point2 <= point3? point2:point3;

                console.log('Magnet Number: ',magnetNumber , items , 1 , items,2,items,3);

                if(!judgement[magnetNumber]){
                    judgement[magnetNumber] = {};
                }

                if(!judgement[magnetNumber][items]){
                    judgement[magnetNumber][items] = {};
                }

                let result1 = resultJudgementPoint(point1)
                let result2 =  resultJudgementPoint(point2)
                let result3 =  resultJudgementPoint(point3)



                //Judgement
                judgement[magnetNumber][items][`p${items}_1`] = result1
                judgement[magnetNumber][items][`p${items}_2`] = result2
                judgement[magnetNumber][items][`p${items}_3`] = result3

                //Judgement theme
                let theme1 = resultTheme(result1)
                let theme2 = resultTheme(result2)
                let theme3 = resultTheme(result3)

                judgement[magnetNumber][items][`p${items}_1_color`] = theme1
                judgement[magnetNumber][items][`p${items}_2_color`] = theme2
                judgement[magnetNumber][items][`p${items}_3_color`] = theme3

                judgement[magnetNumber][items]["min"] = currentMin3points.toFixed(3)
                judgement[magnetNumber][items]["max"] = currentMax3points.toFixed(3)

                const refValues = refereceValues()
                // worst theme
                console.log('WORST DIFFERENCE: ',currentMax3points ,refValues.OK_DIM_MIN ,currentMax3points -  refValues.OK_DIM_MIN  ,  refValues.OK_DIM_MIN - currentMin3points , currentMin3points);

                const worstValue = currentMax3points - refValues.OK_DIM_MIN > refValues.OK_DIM_MIN - currentMin3points ? currentMax3points : currentMin3points
                const worstJudgement = resultJudgementPoint(worstValue)
                const worstTheme = resultTheme(worstJudgement);
                judgement[magnetNumber][items]["worst"] = worstValue
                judgement[magnetNumber][items]["worst_color"] = worstTheme

                //Judgement per Piece
                const divisionStep =   resultStatusJudgement()
                const U91 = divisionStep[4]
                const reultAA95 = refereceValues(U91)
                console.log('ref:',currentMin3points,refValues.AA87 ,  currentMax3points , refValues.AA94,currentMin3points  < refValues.AA87 , currentMax3points > refValues.AA94,reultAA95.AA95);

                const judgementPerPiece =  currentMin3points  < refValues.AA87 || currentMax3points > refValues.AA94 ? 'REJECT':currentMin3points < reultAA95.AA95 || currentMax3points > refValues.AA96?'FOR ADJUSTMENT':'ACCEPT'

                judgement[magnetNumber][items]["piece"] = currentMin3points <= 0 && currentMax3points <= 0? null : judgementPerPiece
                judgement[magnetNumber][items]["piece_color"] =currentMin3points <= 0 && currentMax3points <= 0? null : resultTheme(judgementPerPiece)


                //status
                const status = judgementPerPiece === 'ACCEPT'? "Magnet within specs"
                               :currentMax3points > refValues.AA96 && currentMax3points !== 0 && currentMin3points < reultAA95.AA95 && currentMin3points !== 0  ? "For Adjustment, Magnet minimum & maximum range"
                               :currentMin3points < reultAA95.AA95 && currentMin3points !== 0 ?"For Adjustment, Magnet minimum range "
                               :currentMax3points > refValues.AA96 && currentMax3points !== 0 ?"For Adjustment, Magnet maximum range"
                               :null
                //status theme
                judgement[magnetNumber][items]["status"] = status
                judgement[magnetNumber][items]["status_color"] = currentMin3points <= 0 && currentMax3points <= 0? null: resultTheme(judgementPerPiece)

                //min & max theme
                const minResult = resultJudgementPoint(currentMin3points)
                const maxResult = resultJudgementPoint(currentMax3points)
                const minTheme = resultTheme(minResult)
                const maxTheme = resultTheme(maxResult)

                console.log('MIN MAX',minTheme,maxResult ,currentMin3points);
                judgement[magnetNumber][items]["min_color"] = minTheme
                judgement[magnetNumber][items]["max_color"] = maxTheme

                //remarks
                judgement[magnetNumber][items]["remarks"] = status === "Magnet within specs" ? "Good dimension, Proceed":null
                console.log(divisionStep,refValues,judgementPerPiece,)


                //SPC Control
                const SPCAverage =  point1 > 0 && point2 > 0 && point3 > 0 ? (point1 + point2 + point3)/3:null
                const ConvertedAverage = SPCAverage ? Number(SPCAverage.toFixed(3)):null
                judgement[magnetNumber][items]["average"] = ConvertedAverage


                SPCAverage > 0 ? spcAverage.push(ConvertedAverage):null

                //Average
                console.log('SPC VALUES: ',spcAverage , SPCAverage);
            })

        });



    return(
        <>
            <div>
                <h1>{cghlDetails.model ?? '404 error'}&nbsp;CGH (L) DIMENSION MONITORING</h1>
                <div className="details-container-white">
                    <div>
                        <h1>CGH (L) Specification</h1>
                        <p><strong style={{ fontWeight:'bold' }}>Maximum:</strong>&nbsp;{model && model.cghl_max.toFixed(3)}&nbsp;<strong style={{ fontWeight:'bold' }}>Target:</strong>&nbsp;{model && model.cghl_target.toFixed(3)}&nbsp;<strong style={{ fontWeight:'bold' }}>Minimum:</strong>&nbsp;{model && model.cghl_min.toFixed(3)}</p>
                    </div>
                    <table className="measuring-table">
                        <thead>
                            <tr>

                                <th colSpan={2} rowSpan={2}>S/N</th>
                                <th colSpan={3}>DATA</th>
                                <th colSpan={3}>JUDGEMENT</th>
                                <th rowSpan={2}>JUDEMENT per PIECE</th>
                                <th rowSpan={2}>STATUS</th>
                                <th rowSpan={2}>MIN</th>
                                <th rowSpan={2}>MAX</th>
                                <th rowSpan={2}>REMARKS</th>
                                <th rowSpan={2}>WORST</th>
                            </tr>
                            <tr>
                                <th>Pt.1</th>
                                <th>Pt.2</th>
                                <th>Pt.3</th>
                                <th>Pt.1</th>
                                <th>Pt.2</th>
                                <th>Pt.3</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                 numberThree.map(mainItems =>{
                                    return(

                                        numberThree.map(items =>{
                                            console.log('ITEMSS: ',mainItems,items , judgement);
                                            return(
                                                <tr style={{ background: mainItems ===1 ?'#EFF6FF' : mainItems ===2?'#FEFCE8':'#FFF3E6'  ,height:'3rem'}}>

                                                    {
                                                        items === 1 && <td rowSpan={3} style={{     writingMode: 'vertical-rl'   ,transform: 'rotate(180deg)'}}>{title[mainItems-1]}</td>
                                                    }
                                                    <td>{items}</td>
                                                    <td><input
                                                                type='number'
                                                                onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`p${items}_1`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}/></td>
                                                    <td><input
                                                                type='number'
                                                                onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`p${items}_2`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}
                                                                /></td>
                                                    <td><input
                                                                type='number'
                                                                onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`p${items}_3`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}
                                                                /></td>

                                                    <td
                                                        className={judgement[mainItems] && judgement[mainItems][items][`p${items}_1_color`] ?  judgement[mainItems][items][`p${items}_1_color`]:''}
                                                        >
                                                        {judgement[mainItems] && judgement[mainItems][items][`p${items}_1`] ?  judgement[mainItems][items][`p${items}_1`]:''}
                                                    </td>

                                                    <td className={judgement[mainItems] && judgement[mainItems][items][`p${items}_2_color`] ?  judgement[mainItems][items][`p${items}_2_color`]:''}
                                                        >
                                                        {judgement[mainItems] && judgement[mainItems][items][`p${items}_2`] ?  judgement[mainItems][items][`p${items}_2`]:''}
                                                    </td>

                                                    <td className={judgement[mainItems] && judgement[mainItems][items][`p${items}_3_color`] ?  judgement[mainItems][items][`p${items}_3_color`]:''}
                                                        >
                                                        {judgement[mainItems] && judgement[mainItems][items][`p${items}_3`] ?  judgement[mainItems][items][`p${items}_3`]:''}
                                                    </td>

                                                    <td className={judgement[mainItems] && judgement[mainItems][items][`piece_color`] ?  judgement[mainItems][items][`piece_color`]:''}>
                                                        {judgement[mainItems] && judgement[mainItems][items][`piece`] ?  judgement[mainItems][items][`piece`]:''}
                                                    </td>

                                                    <td style={{ width:'10rem'}} className={judgement[mainItems] && judgement[mainItems][items][`status_color`] && judgement[mainItems][items][`status`]?  judgement[mainItems][items][`status_color`]:''}>
                                                        {judgement[mainItems] && judgement[mainItems][items][`status`] ?  judgement[mainItems][items][`status`]:''}
                                                    </td>

                                                    <td  className={judgement[mainItems] && judgement[mainItems][items]['min'] ? judgement[mainItems] && judgement[mainItems][items]['min_color']:null}
                                                    >{judgement[mainItems] && judgement[mainItems][items]['min'] ?  judgement[mainItems][items][`min`]:''}</td>

                                                    <td  className={judgement[mainItems] && judgement[mainItems][items]['max_color'] ? judgement[mainItems][items]['max_color']:null}
                                                    >{judgement[mainItems] && judgement[mainItems][items]['max'] ?  judgement[mainItems][items][`max`]:''}</td>

                                                    <td style={{ fontWeight:'bold', fontStyle:'italic' ,width:'10rem', textDecoration: 'underline'}} className={judgement[mainItems] && judgement[mainItems][items]['remarks'] ? "success-theme":null }
                                                    >{judgement[mainItems] && judgement[mainItems][items]['remarks'] ?  judgement[mainItems][items][`remarks`]:''}</td>

                                                    <td className={judgement[mainItems] && judgement[mainItems][items][`worst_color`] ?  judgement[mainItems][items][`worst_color`]:''}
                                                    >{judgement[mainItems] && judgement[mainItems][items]['worst'] ?  judgement[mainItems][items][`worst`]:''}</td>
                                                </tr>
                                            )
                                        })
                                    )

                                 })

                            }

                        </tbody>
                    </table>
                </div>
                <div>
                    <h1>SPC Control Details</h1>
                    <div className="details-container-white-row">
                        <div className="container-column">
                            <div className="container-row-between">
                                <label>Average</label>
                                <input disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Maximum</label>
                                <input/>
                            </div>
                            <div style={{ width:'10rem'}} className="container-row-between">
                                <label>Minimum</label>
                                <input disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div style={{ width:'10rem'}} className="container-row-between">
                                <label>Stdev</label>
                                <input disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cp</label>
                                <input disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cpl</label>
                                <input disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>Cpu</label>
                                <input disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cpk</label>
                                <input disabled={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
