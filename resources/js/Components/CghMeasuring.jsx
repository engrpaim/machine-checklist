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
    const mapDivision = {}
    const [model,setModel] = useState(false);

    useEffect(()=>{
        if(!currentModel) return
        setModel(currentModel);
    },[currentModel])

    const resultJudgementPoint=(point)=>{
        //return judgement status
        const AA90 = currentModel.cghl_target - 0.001
        const AA91 = currentModel.cghl_max - 0.005
        const AA87 = currentModel.cghl_min
        const AAMax = currentModel.cghl_max

       return  point > AA90 && point < AA91? 'GOOD' :point >= AA87 && point <= AAMax ?'ADJUST' :point ? 'REJECT':null
    }


    const resultStatusJudgement=()=>{
        const max = currentModel.cghl_max
        const min = currentModel.cghl_min

        const TOL = max - min
        const STEP = Number((TOL/10).toFixed(3))
        console.log('Tolerance: ',TOL,'STEP: ',STEP);
        const range = {}
        return STEP;
    }

    const resultTheme =(value)=>{
        //return theme color
        console.log( 'hello' ,value);
        switch(value){
            case "GOOD":
                return 'success-theme'
                break;
            case "ADJUST":
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




                let currentMax3points = point1 > point2 && point1 > point3? point1:point1 < point2 && point2> point3? point2:point3;
                let currentMin3points = point1 < point2 && point1 < point3? point1:point1 > point2 && point2< point3? point2:point3;






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

                // worst theme
                const worstJudgement = resultJudgementPoint(currentMin3points)
                const worstTheme = resultTheme(worstJudgement);
                judgement[magnetNumber][items]["worst"] = worstTheme



            })

        });

    resultStatusJudgement()

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
                                                <tr style={{ background: mainItems ===1 ?'#EFF6FF' : mainItems ===2?'#FEFCE8':'#FFF3E6'  }}>

                                                    {
                                                        items === 1 && <td rowSpan={3} style={{     writingMode: 'vertical-rl'   ,transform: 'rotate(180deg)'}}>{title[mainItems-1]}</td>
                                                    }
                                                    <td>{items}</td>
                                                    <td><input
                                                                onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`p${items}_1`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}/></td>
                                                    <td><input onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`p${items}_2`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}
                                                                /></td>
                                                    <td><input onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
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
                                                    <td className="">Judegment</td>
                                                    <td>Status</td>
                                                    <td>{judgement[mainItems] && judgement[mainItems][items]['min'] ?  judgement[mainItems][items][`min`]:''}</td>
                                                    <td>{judgement[mainItems] && judgement[mainItems][items]['min'] ?  judgement[mainItems][items][`max`]:''}</td>
                                                    <td>remarks</td>
                                                    <td className={judgement[mainItems] && judgement[mainItems][items][`worst`] ?  judgement[mainItems][items][`worst`]:''}
                                                    >{judgement[mainItems] && judgement[mainItems][items]['min'] ?  judgement[mainItems][items][`min`]:''}</td>
                                                </tr>
                                            )
                                        })
                                    )

                                 })

                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
