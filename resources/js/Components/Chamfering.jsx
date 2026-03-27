export default function Chamfering({ goToNextInput, setMagnetPoints, magnetPoints, model, process, chamfertype, handleKeyDown, status, edit ,pointIdentifier = 1}) {

    const number = [1, 2, 3, 4, 5]
    const chamferValue = {
        'R- CHAMFER': 2.415,
        'C - Chamfer': 1.414,
        'REF. VAL.': 0.207
    }
    const specsBank = {
        barelling: {
            chamfer: {
                target: model.chamfer_barelling_target ?? 0, max: model.chamfer_barelling_max ?? 0, min: model.chamfer_barelling_min ?? 0
            },
             chamfer2: {
                target: model.chamfer_barelling_target2 ?? 0, max: model.chamfer_barelling_max2 ?? 0, min: model.chamfer_barelling_min2 ?? 0
            }
        },
    };
    const chamferValues = magnetPoints.chamfer
    console.log('CHAMFER VALUE: ', chamfertype);
    const judegment = { m1: {}, m2: {}, m3: {}, m4: {}, m5: {} }

    number.map((items) => {
        const magnet = magnetPoints['chamfer'+pointIdentifier]['m' + items] !== 0 ? Number(((chamferValue['REF. VAL.'] - magnetPoints['chamfer'+pointIdentifier]['m' + items]) * chamferValue[chamfertype]).toFixed(3)) : 0

        const lowerReject = pointIdentifier === 1 ? Number((specsBank[process]["chamfer"].min + 0.001).toFixed(3)):Number((specsBank[process]["chamfer2"].min + 0.001).toFixed(3))

        if (magnet === 0) return judegment['m' + items] = { judegment: null, value: magnet, theme: null };
        if (magnet < lowerReject) return judegment['m' + items] = { judegment: 'adjust', value: magnet, theme: 'adjust-theme' };
        if (pointIdentifier === 1 && magnet > specsBank[process]["chamfer"].max || magnet > specsBank[process]["chamfer2"].max) return judegment['m' + items] = { judegment: 'reject', value: magnet, theme: 'error-theme' };
        return judegment['m' + items] = { judegment: 'good', value: magnet, theme: 'success-theme' };
    })
    console.log('CHAMFER DISPLAY: ', magnetPoints, status);
    return (
        <div className="details-container-gray">
            <div>
                <h1>{
                    pointIdentifier === 1 ? 'Point A' : 'Point B'
                }</h1>
            </div>
            <div>
                <table className="measuring-table" >
                    <thead>
                        <tr className="measuring-box-head">
                            <th colSpan={6}>Magnet Samples</th>
                            <th colSpan={5}>Judegment Per Piece</th>
                        </tr>
                        <tr className="measuring-box-head">
                            <th colSpan={11}>Minimum:&nbsp;{pointIdentifier === 1 ? specsBank[process]["chamfer"].min : specsBank[process]["chamfer2"].min}&nbsp;Target:&nbsp;{pointIdentifier === 1 ? specsBank[process]["chamfer"].target :  specsBank[process]["chamfer2"].target}&nbsp;Maximum:&nbsp;{pointIdentifier === 1 ?specsBank[process]["chamfer"].max :specsBank[process]["chamfer2"].max}&nbsp;Chamfer Type:{chamfertype}</th>
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
                                        <input
                                            key={items}
                                            type="number"
                                            onChange={(e) => setMagnetPoints(prev => ({ ...prev, ['chamfer'+pointIdentifier]: { ...prev['chamfer'+pointIdentifier], ['m' + items]: Number(e.target.value) } }))}
                                            onKeyDown={(e) => handleKeyDown(e)} value={magnetPoints['chamfer'+pointIdentifier]['m' + items] ? magnetPoints['chamfer'+pointIdentifier]['m' + items] : ''}
                                            disabled={(status === 'approved' || status === 'measured') && !(edit)}
                                        />
                                    </td>
                                )
                            }
                            {
                                number.map((items) =>
                                    <td
                                        key={items}
                                        className={judegment['m' + items].theme ?? null}

                                    >{judegment['m' + items].value !== 0 ? judegment['m' + items].value + ' ' + `(${judegment['m' + items].judegment.toUpperCase()})` : null}</td>
                                )
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
