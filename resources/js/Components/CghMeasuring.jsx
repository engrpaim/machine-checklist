import { useState ,useEffect , useRef} from "react";
import GraphControlX from "./GraphControlX";
export default function CghMeasuring({cghlDetails,cghlPoint ,setCghlPoint,currentModel,handleKeyDown,cghTools,setCghTools}){
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
    const RAverage = [];
    const XAverage = [];
    const SPCControlls = {};
    const [model,setModel] = useState(false);

    //CountCurrentMagnet
    const magnet = useRef(0)
    magnet.current = 0
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
       return  point  < refValueNew.AA87 || point > refValueNew.AA94 ? 'REJECT':point < refValueNew.OK_DIM_MIN || point > refValueNew.AA96?'FOR ADJUSTMENT':'ACCEPT'
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

    const handleAverage=(array,container,suffix)=>{
        //return average ,max ,min of the dataset
        let count = 0;
        let runningAverage = 0;
        let maxAverage = 0;
        let minAverage = 0;

        for( let i = 0 ; i < array.length ; i++  ){
            if(array[i]){
                //compute average , set maximum and minimum
                count += 1
                runningAverage += array[i]
                maxAverage = array[i] > maxAverage ? array[i]: maxAverage
                minAverage = array[i] < minAverage || minAverage  === 0? array[i] : minAverage

            }
        }
        // finalAverage = sum of average / number of average
        const finalAverage = runningAverage ? runningAverage/count:0
        container['average'+suffix] = finalAverage > 0  ?Number(finalAverage.toFixed(3)):null
        container['max'+suffix] = maxAverage > 0  ?maxAverage:null
        container['min'+suffix] = minAverage > 0  ?minAverage:null
    }

    const handleStandardDev=(array,container ,average)=>{
        console.log('Standard Dev: ' ,array , container,average);
        let summation = 0;
        let count = 0;

        //∑ (xi−xˉ)^2
        for (let i = 0 ; i < array.length; i++ ){
            if(array[i] > 0){
                console.log('xi: ' , array[i], ' xˉ: ',average , ' mean: ',(array[i] - average) ** 2);
                summation += (array[i] - average) ** 2
                count +=1
            }
        }

        //mean
        const mean = summation / (count - 1)

        // get square root
        const stdev = Math.sqrt(mean)

        container["stdev"] = Number(stdev.toFixed(3))

        console.log('summation: ',summation , ' count: ', count , ' stdev: ',stdev.toFixed(3))
    }

    const handleProcessCapabilityIndex =(array,container,min,max)=>{
        console.log('Process Capability Index: ',array,container,min,max,container.stdev);
        if(!container.stdev) return
        const tol = max.toFixed(3) - min
        const stdev = container.stdev
        const cp = Number(tol.toFixed(3))/(6 * stdev)
        container['cp'] = Number(cp.toFixed(3))
    }

    const handleCPLLowerCapabilityIndex =(array,container,min,average)=> {
        console.log('LOWER CAPABILITY INDEX: ',array,container,min);
        const currentAverage = average
        const currentMin = min
        const stdev = container.stdev

        const cpl = (currentAverage - currentMin)/(3*stdev)
        container["cpl"] = Number(cpl.toFixed(3))
    }

    const handleCPUUpperCapability =(array,container,max,average)=> {
        console.log('LOWER CAPABILITY INDEX: ',array,container,max);
        const currentAverage = average
        const currentMax= max
        const stdev = container.stdev

        const cpu = (currentMax - currentAverage)/(3*stdev)
        container["cpu"] = Number(cpu.toFixed(3))
    }

    const handleUCL =(array,container,Average,cl)=>{
        const averageCurrent = Average
        const averageR = cl
        container['ucl'] = averageCurrent + 0.34 * averageR
        container['lcl'] = averageCurrent - 0.34 * averageR
        container['cl'] = Average
        console.log('UCLz: ',array,container,Average);
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
            console.log('DIFFERENCE: ',currentMax3points -  currentMin3points ,currentMax3points ,  currentMin3points);
            const rValueCurrent = (currentMax3points -  currentMin3points).toFixed(3)

            //R value
            rValueCurrent && currentMax3points > 0 && currentMin3points > 0  ? RAverage.push(Number(rValueCurrent)):null

            const RAverageValues = handleAverage(RAverage ,SPCControlls , '_UCL');
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
            SPCAverage && SPCAverage > 0 ? XAverage.push(Number(SPCAverage.toFixed(3))):null
            const ConvertedAverage = SPCAverage ? Number(SPCAverage.toFixed(3)):null
            judgement[magnetNumber][items]["average"] = ConvertedAverage

            //Average over all
            SPCAverage > 0 ? spcAverage.push(ConvertedAverage):null
            const resultAverage =  spcAverage ? handleAverage(spcAverage,SPCControlls,''):null

            //Standard Dev
            SPCControlls && SPCControlls.average ? handleStandardDev(spcAverage,SPCControlls,SPCControlls.average):null

            //Process Capability index
            SPCControlls && SPCControlls.stdev ? handleProcessCapabilityIndex(spcAverage,SPCControlls,refValues.AA87 , refValues.AA94):null
            SPCControlls && SPCControlls.stdev ? handleCPUUpperCapability(spcAverage,SPCControlls,refValues.AA94,SPCControlls.average):null

            //Process Capability lower index
            SPCControlls && SPCControlls.stdev ? handleCPLLowerCapabilityIndex(spcAverage,SPCControlls,refValues.AA87,SPCControlls.average):null

            //Process Capability index CPK
            const cpk = SPCControlls && SPCControlls.cpu && SPCControlls.cpl ?
                            SPCControlls.cpu < SPCControlls.cpl ?
                                SPCControlls.cpu : SPCControlls.cpl
                            :null

            cpk ? SPCControlls["cpk"] = cpk:null

            //x control ucl
            SPCControlls && SPCControlls.average ? handleUCL(RAverage,SPCControlls,SPCControlls.average,SPCControlls.average_UCL):null

            //r control
            SPCControlls &&  SPCControlls.average_UCL ? SPCControlls["r_ucl"] = 1.82  * SPCControlls.average_UCL:null
            console.log('SPC VALUES: ' , spcAverage, spcAverage.length,SPCControlls , RAverage ,XAverage);
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
                                                 magnet.current += 1
                                            return(
                                                <tr style={{ background: mainItems ===1 ?'#EFF6FF' : mainItems ===2?'#FEFCE8':'#FFF3E6'  ,height:'3rem'}}>

                                                    {
                                                        items === 1 && <td rowSpan={3} style={{     writingMode: 'vertical-rl'   ,transform: 'rotate(180deg)'}}>{title[mainItems-1]}</td>
                                                    }
                                                    <td>{magnet.current}</td>
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

                                                    <td style={{ fontWeight:'bold', fontStyle:'italic' ,width:'10rem', textDecoration: 'underline'}} className={judgement[mainItems] && judgement[mainItems][items]['remarks'] ? "success-theme":null }>
                                                        {
                                                            judgement[mainItems] && judgement[mainItems][items]['remarks'] ?  judgement[mainItems][items][`remarks`]:
                                                            <input

                                                                onChange={(e)=>{setCghlPoint(`magnet_${mainItems}`,{
                                                                    ...cghlPoint[`magnet_${mainItems}`],[`remarks`]:e.target.value
                                                                })}}
                                                                onKeyDown={(e)=>handleKeyDown(e)}
                                                                style={{ width:'10rem' }}/>
                                                        }
                                                    </td>

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
                    <h1>Dimension graph</h1>
                    <GraphControlX XAverage={XAverage}/>
                </div>
                <div>
                    <h1>Measuring Tools</h1>
                    <div className="container-row">
                        <div className="details-container-white-row">
                            <div className="container-column">
                                <div className="container-row-between">
                                    <label>Form Gauge Serial No.</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('form_gauge',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>n=9</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('form_n9',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>Sorted By:</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('form_sorted',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>Remarks:</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('form_remarks',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                            </div>
                        </div>
                        <div className="details-container-white-row">
                            <div className="container-column">
                                <div className="container-row-between">
                                    <label>Go/No Go Jig Serial No.:</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('go_serial',e.target.value)}  onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>Go/No Go Jig Validation:</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('go_validation',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>n=9</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('go_n9',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                                <div className="container-row-between">
                                    <label>Sorted By:</label>
                                    <input style={{ width:'10rem' }} onChange={(e)=>setCghTools('go_sorted',e.target.value)} onKeyDown={(e)=>handleKeyDown(e)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>SPC Control</h1>
                    <div className="details-container-white-row">
                        <div className="container-column">
                            <div className="container-row-between">
                                <label>Average</label>
                                <input value={SPCControlls.average ? SPCControlls.average.toFixed(3):null} disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Maximum</label>
                                <input value={SPCControlls.max ? SPCControlls.max.toFixed(3):null} disabled={true}/>
                            </div>
                            <div style={{ width:'10rem'}} className="container-row-between">
                                <label>Minimum</label>
                                <input value={SPCControlls.min ? SPCControlls.min.toFixed(3):null} disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div style={{ width:'10rem'}} className="container-row-between">
                                <label>Stdev</label>
                                <input  value={SPCControlls.stdev ? SPCControlls.stdev.toFixed(3):null} disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cp</label>
                                <input value={SPCControlls.cp ? SPCControlls.cp.toFixed(3):null} disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cpl</label>
                                <input value={SPCControlls.cpl ? SPCControlls.cpl.toFixed(3):null} disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>Cpu</label>
                                <input value={SPCControlls.cpu ? SPCControlls.cpu.toFixed(3):null} disabled={true}/>
                            </div>
                            <div className="container-row-between">
                                <label>Cpk</label>
                                <input value={SPCControlls.cpk ? SPCControlls.cpk.toFixed(3):null} disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div className="container-row-between" style={{ fontWeight:'bold' }}>X Control</div>
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>UCL</label>
                                <input value={SPCControlls.ucl ? SPCControlls.ucl.toFixed(3):null} disabled={true}/>
                            </div>
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>CL</label>
                                <input value={SPCControlls.cl ? SPCControlls.cl.toFixed(3):null} disabled={true}/>
                            </div>
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>UCL</label>
                                <input value={SPCControlls.lcl ? SPCControlls.lcl.toFixed(3):null} disabled={true}/>
                            </div>
                        </div>
                        <div className="container-column">
                            <div className="container-row-between" style={{ fontWeight:'bold' }}>R Control</div>
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>UCL</label>
                                <input value={SPCControlls.r_ucl ? SPCControlls.r_ucl.toFixed(3):null} disabled={true}/>
                            </div>
                            <div  style={{ width:'10rem'}} className="container-row-between">
                                <label>CL</label>
                                <input value={SPCControlls.average_UCL ? SPCControlls.average_UCL.toFixed(3):null} disabled={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
