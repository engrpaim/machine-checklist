export default function Chamfering({ goToNextInput, setMagnetPoints, magnetPoints, model, process, chamfertype, handleKeyDown, status, edit ,pointIdentifier = 1}) {

    const number = [1, 2, 3, 4, 5]
    const points = [1 ,2]
    const chamferValue = {
        'R- CHAMFER': 2.415,
        'C - Chamfer': 1.414,
        'REF. VAL.': 0.207
    }
    const specsBank = {
        barelling: {
            chamfer1: {
                target: model.chamfer_barelling_target ?? 0, max: model.chamfer_barelling_max ?? 0, min: model.chamfer_barelling_min ?? 0
            },
             chamfer2: {
                target: model.chamfer_barelling_target2 ?? 0, max: model.chamfer_barelling_max2 ?? 0, min: model.chamfer_barelling_min2 ?? 0
            }
        },
    };
    const chamferValues = magnetPoints.chamfer
    console.log('CHAMFER VALUE: ', chamfertype);
    const judegment = { }
    const pointsJudgement = { chamfer1:{},chamfer2:{}}
    points.map((count)=>{
         number.map((items) => {
            const magnet = magnetPoints['chamfer'+count]['m' + items] !== 0 ? Number(((chamferValue['REF. VAL.'] - magnetPoints['chamfer'+count]['m' + items]) * chamferValue[chamfertype]).toFixed(3)) : 0

            const lowerReject =Number((specsBank[process]["chamfer"+count].min + 0.001).toFixed(3))

            if (magnet === 0) return judegment[count +'m' + items] = { judegment: null, value: magnet, theme: null };
            if (magnet < lowerReject) return judegment[count+'m' + items] = { judegment: 'adjust', value: magnet, theme: 'adjust-theme' };
            if ( magnet > specsBank[process]["chamfer"+count].max ) return judegment[count+'m' + items] = { judegment: 'reject', value: magnet, theme: 'error-theme' };
            return judegment[count +'m' + items] = { judegment: 'good', value: magnet, theme: 'success-theme' };
        })
    })


    console.log('CHAMFER DISPLAY: ', magnetPoints, status,judegment);
    return (
        <div className="details-container-gray">
            <div>
                <h1>Chamfering</h1>
            </div>
            <div>
                <table className="measuring-table" >
                    <thead>
                        <tr className="measuring-box-head">
                            <th colSpan={6}>Magnet Samples</th>
                            <th colSpan={5}>Judegment Per Piece</th>
                        </tr>
                        <tr className="measuring-box-head">
                            <th colSpan={11}>
                                Minimum:&nbsp;{specsBank[process]["chamfer1"].min.toFixed(3)}&nbsp;Target:&nbsp;{ specsBank[process]["chamfer1"].target.toFixed(3)}&nbsp;Maximum:&nbsp;{specsBank[process]["chamfer1"].max.toFixed(3) }&nbsp;&nbsp;
                                &nbsp;&nbsp;{pointIdentifier === 2 ? <>Minimum:&nbsp;{specsBank[process]["chamfer2"].min.toFixed(3)}&nbsp;Target:&nbsp;{ specsBank[process]["chamfer2"].target.toFixed(3)}&nbsp;Maximum:&nbsp;{specsBank[process]["chamfer2"].max.toFixed(3) }</>:null}&nbsp;&nbsp;
                                &nbsp;&nbsp;Chamfer Type:&nbsp;{chamfertype}
                            </th>
                        </tr>
                        <tr>
                            <th className="measuring-box-title"> Machine  No.</th>
                            <th className="measuring-box-title">Magent 1</th>
                            <th className="measuring-box-title">Magent 2</th>
                            <th className="measuring-box-title">Magent 3</th>
                            <th className="measuring-box-title">Magent 4</th>
                            <th className="measuring-box-title">Magent 5</th>
                            <th className="measuring-box-title">Magent 1</th>
                            <th className="measuring-box-title">Magent 2</th>
                            <th className="measuring-box-title">Magent 3</th>
                            <th className="measuring-box-title">Magent 4</th>
                            <th className="measuring-box-title">Magent 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="measuring-box-data">
                                <input
                                    onChange={(e) => setMagnetPoints(prev => ({ ...prev, ['chamfer'+pointIdentifier]: { ...prev['chamfer'+pointIdentifier], ['machine']: e.target.value } }))}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    value={magnetPoints['chamfer'+pointIdentifier].machine ? magnetPoints['chamfer'+pointIdentifier].machine : ''}
                                    disabled={(status === 'approved' || status === 'measured') && !(edit)}
                                />
                            </td>
                            {
                                number.map((items) =>
                                    <td className="measuring-box-data">
                                        <div>
                                            Point A
                                            <input
                                                key={items}
                                                type="number" min="0.000" max="100"
                                                onChange={(e) => setMagnetPoints(prev => ({ ...prev, ['chamfer'+1]: { ...prev['chamfer'+1], ['m' + items]: Number(e.target.value) } }))}
                                                onKeyDown={(e) => handleKeyDown(e)}
                                                value={magnetPoints['chamfer'+1]['m' + items]!== undefined?   magnetPoints['chamfer'+1]['m' + items] : ''}
                                                disabled={(status === 'approved' || status === 'measured') && !(edit)}
                                            />
                                        </div>
                                        {
                                            pointIdentifier === 2 ?
                                            <div>
                                              Point B
                                              <input
                                                key={items}
                                                type="number" min="0.000" max="100"
                                                onChange={(e) => setMagnetPoints(prev => ({ ...prev, ['chamfer'+pointIdentifier]: { ...prev['chamfer'+pointIdentifier], ['m' + items]: Number(e.target.value) } }))}
                                                onKeyDown={(e) => handleKeyDown(e)}
                                                value={magnetPoints['chamfer'+pointIdentifier]['m' + items]!== undefined?   magnetPoints['chamfer'+pointIdentifier]['m' + items] : ''}
                                                disabled={(status === 'approved' || status === 'measured') && !(edit)}
                                                />
                                            </div>
                                            :null
                                        }
                                    </td>
                                )
                            }
                            {

                                number.map((items) =>
                                    <td
                                        key={items}


                                    >
                                        <div  className={judegment[1+'m' + items].theme ?? null}>
                                           A {judegment[1+'m' + items].value !== 0 ? judegment[1+'m' + items].value + ' ' + `(${judegment[1+'m' + items].judegment.toUpperCase()})` : null}
                                        </div>
                                        {
                                            pointIdentifier === 2 ?
                                            <div  className={judegment[2+'m' + items].theme ?? null}>
                                              {judegment[2+'m' + items].value !== 0 ? 'B ' + judegment[2+'m' + items].value + ' ' + `(${judegment[2+'m' + items].judegment.toUpperCase()})` : null}
                                            </div> :null
                                        }
                                    </td>
                                )
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
