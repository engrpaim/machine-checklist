import {
    Chart as ChartJS,
    PointElement,
    LineElement,
    LinearScale,
    Tooltip,
    CategoryScale,
    Legend
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
    PointElement,
    LineElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    annotationPlugin,
    ChartDataLabels

);



export default function MeasuringData({ goToNextInput, setMagnetPoints, magnetPoints, model, process, status, edit }) {
    console.log('Modeeelll: ',model);
    const maxMagnet = [1, 2, 3, 4, 5];
    const specsBank = {
        barelling: {
            model: {
                target: Number(model.barelling_target ?? 0), max: Number(model.barelling_max ?? 0), min: Number(model.barelling_min ?? 0)
            },
        },
    };
    console.log(magnetPoints);
    const JudgementPoints = {};
    maxMagnet.map((items) => {
        if (!magnetPoints) return
        const pointsValue = magnetPoints['magnet_' + items]

        let worst = 0;
        let maximum = 0;
        let minimum = 9999;
        let diffmax = 0;
        let diffmin = 0;
        let average = 0;
        let countCount = 0;
        Object.entries(pointsValue).map(([key, value]) => {
            console.log('Setting judgement: ',key, value,countCount);
            countCount = value > 0 ? countCount +=1 :countCount
            average += value ;
            value > maximum ? maximum = value : maximum;
            value < minimum  && value !== 0 ? minimum = value :null;
            diffmax = specsBank[process]["model"].target - maximum;
            diffmin = specsBank[process]["model"].target - minimum;
        })
        JudgementPoints[items] = {
            p: items,
            average: Number((average/countCount).toFixed(3)),
            maximum: Number(maximum.toFixed(3)),
            minimum: Number(minimum.toFixed(3)),
            diffmax: Math.abs(Number(diffmax.toFixed(3))),
            diffmin: Math.abs(Number(diffmin.toFixed(3)))
        }
    });

    const formattedData = Array.from({ length: 5 }, (_, i) => {
        const pointIndex = i + 1;
        return [
            { x: 'Point', y: null },
            {
                x: 'Magnet 1',
                y: magnetPoints.magnet_1[`p${pointIndex}`],
                p: `${pointIndex}`
            },
            {
                x: 'Magnet 2',
                y: magnetPoints.magnet_2[`p${pointIndex}`],
                p: `${pointIndex}`
            },
            {
                x: 'Magnet 3',
                y: magnetPoints.magnet_3[`p${pointIndex}`],
                p: `${pointIndex}`
            },
            {
                x: 'Magnet 4',
                y: magnetPoints.magnet_4[`p${pointIndex}`],
                p: `${pointIndex}`
            },
            {
                x: 'Magnet 5',
                y: magnetPoints.magnet_5[`p${pointIndex}`],
                p: `${pointIndex}`
            },
            { x: 'End', y: null }
        ];
    }).flat();




    const data = {
        datasets: [
            {
                label: 'Good',
                backgroundColor: 'green',
                data: formattedData,

                showLine: true,
                tension: 0.3,
                pointRadius: 15,
                pointBackgroundColor: formattedData.map(p =>
                    p.y < specsBank[process]["model"].min || p.y > specsBank[process]["model"].max ? 'red'
                    :p.y <= specsBank[process]["model"].min + .010 || p.y >= specsBank[process]["model"].max - .010 ? 'orange'
                    :'green'
                ),

            },
            {
                label: 'Reject',
                backgroundColor: 'red'
            },
            {
                label: 'Adjust',
                backgroundColor: 'orange'
            },
        ],

    };
    //'#0B2F3D'
    console.log('Judegment: ', JudgementPoints);
    console.log('Formatted: ', formattedData);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                ticks: {
                    color: function (context) {
                        const label = context.tick.label;
                        const number = Number(label.split(" ")[1]) ?? 0
                        if (label === 'Point' || label === 'End') return '#6A758A'
                        if ((label === 'Magnet 1' || label === 'Magnet 2' || label === 'Magnet 3' || label === 'Magnet 4' || label === 'Magnet 5')

                            && JudgementPoints[number].minimum > specsBank[process]["model"].min && JudgementPoints[number].maximum < specsBank[process]["model"].max) return '#6A758A';

                        return 'red'
                    },
                    font: {
                        size: 12,
                        family: 'Poppins',
                        weight: 'bold'
                    },
                },
                grid: { color: '#CCD0D8' },
            },

            y: {
                min: specsBank[process]["model"].min - 0.01,
                max: specsBank[process]["model"].max + 0.01,
                ticks: {
                    color: '#6A758A',
                    font: {
                        size: 12,
                        family: 'Poppins',
                        weight: 'bold'
                    }
                },
                grid: { color: '#CCD0D8' },
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    upper: {
                        type: 'box',
                        yMin: specsBank[process]["model"].max - .010,
                        yMax: specsBank[process]["model"].max,
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        borderWidth: 0,
                        drawTime: 'beforeDatasetsDraw'
                    },
                    lower: {
                        type: 'box',
                        yMin: specsBank[process]["model"].min,
                        yMax: specsBank[process]["model"].min + .010,
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        borderWidth: 0,
                        drawTime: 'beforeDatasetsDraw'
                    }
                }
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 10
                },
                formatter: (value) => value.p,
                align: 'center',
                anchor: 'center',
                clamp: true
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const raw = context.raw;
                        if (!raw || raw.y === null) return '';
                        return `Point ${raw.p}: ${raw.y}mm`;
                    }
                }
            }
        }
    };

    const judgementTable =(average)=>{
          console.log('Detailssx: ', average, specsBank[process]["model"].min )

        if(!average || average <= 0)  return { judegement:null , background:null}


        const JudegmentDiplay =
            average > specsBank[process]['model'].max || average <  specsBank[process]["model"].min ? 'Reject':
            average <= specsBank[process]['model'].max  &&  average >= specsBank[process]['model'].max - 0.010 || average >= specsBank[process]['model'].min  &&  average <= specsBank[process]['model'].min + 0.010? 'Adjust'
            :'Good'



        const backgroundTheme = JudegmentDiplay === 'Reject' ?'error-theme': JudegmentDiplay === 'Adjust' ?'adjust-theme':'success-theme';
        console.log('JTx',JudegmentDiplay,backgroundTheme);

        return { judegement:JudegmentDiplay ,  background:backgroundTheme}

    }

    console.log('BANK: ',specsBank[process]['model'] ,'Magnet: ', maxMagnet);
    return (
        <div className='container-fixed-row'>
            <div>
                <h1>Barelling Thickness</h1>
            </div>
            <div className='container-row'>
                <div className='details-white'>
                    <div className='container-column'>
                        <div className='container-theme-black'>
                            <h1>Thickness</h1>
                            <p>Minimum:&nbsp;{specsBank[process]["model"].min}&nbsp;Target:&nbsp;{specsBank[process]["model"].target}&nbsp;Maximum:&nbsp;{specsBank[process]["model"].max}</p>
                        </div>
                        <table className='measuring-process' border={1} >
                            <thead>
                                <tr>
                                    <th colSpan={15} className='titletables'>ACTUAL DIMENSION</th>
                                </tr>
                                <tr>
                                    <th style={{ background: '#9CDBED' }}>No</th>
                                    <th className='pt-color' style={{ background: '#FFFBE6' }}>Pt. 1</th>
                                    <th className='pt-color' style={{ background: '#FFFBE6' }}>Pt. 2</th>
                                    <th className='pt-color' style={{ background: '#FFFBE6' }}>Pt. 3</th>
                                    <th className='pt-color' style={{ background: '#FFFBE6' }}>Pt. 4</th>
                                    <th className='pt-color' style={{ background: '#FFFBE6' }}>Pt. 5</th>
                                    <th className='worst-color' style={{ background: '#FFB86A' }}>Worst</th>
                                    <th>Maximum</th>
                                    <th>Minimum</th>
                                    <th className='worst-color'>Target</th>
                                    <th>Max Diff</th>
                                    <th>Min Diff</th>
                                    <th>Average</th>
                                    <th>Judgement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    maxMagnet.map((items) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td style={{ background: '#9CDBED' }}>{items}</td>
                                                    <td>
                                                        <input


                                                            type="number"
                                                            onChange={
                                                                (e) =>
                                                                    setMagnetPoints(prev => ({
                                                                        ...prev,
                                                                        ['magnet_' + items]: {
                                                                            ...prev['magnet_' + items],
                                                                            ['p' + 1]: Number(e.target.value)
                                                                        }
                                                                    }))
                                                            }
                                                            value={magnetPoints['magnet_' + items]['p' + 1] ? magnetPoints['magnet_' + items]['p' + 1] : ''}
                                                            onKeyDown={(e) => e.key === 'Enter' ? goToNextInput(e) : null}
                                                           disabled={((status === 'approved' || status === 'measured') && !(edit)) || !(model.point >= 1 ? true:false )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input

                                                            type="number"
                                                            onChange={
                                                                (e) =>
                                                                    setMagnetPoints(prev => ({
                                                                        ...prev,
                                                                        ['magnet_' + items]: {
                                                                            ...prev['magnet_' + items],
                                                                            ['p' + 2]: Number(e.target.value)
                                                                        }
                                                                    }))
                                                            }
                                                            value={magnetPoints['magnet_' + items]['p' + 2] ? magnetPoints['magnet_' + items]['p' + 2] : ''}
                                                            onKeyDown={(e) => e.key === 'Enter' ? goToNextInput(e) : null}
                                                            disabled={((status === 'approved' || status === 'measured') && !(edit)) || !(model.point >= 2 ? true:false )} />
                                                    </td>
                                                    <td>
                                                        <input

                                                            type="number"
                                                            onChange={
                                                                (e) =>
                                                                    setMagnetPoints(prev => ({
                                                                        ...prev,
                                                                        ['magnet_' + items]: {
                                                                            ...prev['magnet_' + items],
                                                                            ['p' + 3]: Number(e.target.value)
                                                                        }
                                                                    }))
                                                            }
                                                            value={magnetPoints['magnet_' + items]['p' + 3] ? magnetPoints['magnet_' + items]['p' + 3] : ''}
                                                            onKeyDown={(e) => e.key === 'Enter' ? goToNextInput(e) : null}
                                                            disabled={((status === 'approved' || status === 'measured') && !(edit)) || !(model.point >= 3 ? true:false )} />
                                                    </td>
                                                    <td>
                                                        <input

                                                            type="number"
                                                            
                                                            onChange={
                                                                (e) =>
                                                                    setMagnetPoints(prev => ({
                                                                        ...prev,
                                                                        ['magnet_' + items]: {
                                                                            ...prev['magnet_' + items],
                                                                            ['p' + 4]: Number(e.target.value)
                                                                        }
                                                                    }))
                                                            }
                                                            value={magnetPoints['magnet_' + items]['p' + 4] ? magnetPoints['magnet_' + items]['p' + 4] : ''}
                                                            onKeyDown={(e) => e.key === 'Enter' ? goToNextInput(e) : null}
                                                            disabled={((status === 'approved' || status === 'measured') && !(edit)) || !(model.point >= 4 ? true:false )} />
                                                    </td>
                                                    <td>
                                                        <input

                                                            type="number"
                                                            onChange={
                                                                (e) =>
                                                                    setMagnetPoints(prev => ({
                                                                        ...prev,
                                                                        ['magnet_' + items]: {
                                                                            ...prev['magnet_' + items],
                                                                            ['p' + 5]: Number(e.target.value)
                                                                        }
                                                                    }))
                                                            }
                                                            value={magnetPoints['magnet_' + items]['p' + 5] ? magnetPoints['magnet_' + items]['p' + 5] : ''}
                                                            onKeyDown={(e) => e.key === 'Enter' ? goToNextInput(e) : null}
                                                            disabled={((status === 'approved' || status === 'measured') && !(edit)) || !(model.point >= 5 ? true:false )} />
                                                    </td>
                                                    <td style={{ background: '#FFDCB8' }}>{JudgementPoints[items].maximum ?? null}</td>
                                                    <td style={{ color: JudgementPoints[items].maximum > specsBank[process]["model"].min && JudgementPoints[items].maximum < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].maximum ?? null}</td>
                                                    <td style={{ color: JudgementPoints[items].minimum > specsBank[process]["model"].min && JudgementPoints[items].minimum < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].minimum ?? null}</td>
                                                    <td style={{ fontWeight: "bold" }}>{specsBank[process]["model"].target}</td>
                                                    <td>{JudgementPoints[items].diffmax?? null}</td>
                                                    <td>{JudgementPoints[items].diffmin ?? null}</td>
                                                    <td style={{ color: JudgementPoints[items].average > specsBank[process]["model"].min && JudgementPoints[items].average < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].average  ? JudgementPoints[items].average :0}</td>
                                                    <td className={judgementTable(JudgementPoints[items].average).background}>
                                                        {
                                                            judgementTable(JudgementPoints[items].average).judegement
                                                        }
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='details-white'>
                    <div className='container-column'>
                        <div className='container-theme-black'>
                            <h1>Thickness Judgement</h1>
                        </div>
                        <div className='container-row'>
                            <div className='measuring-points-graph' style={{ backgroundColor: 'white', width:'27rem'}}>
                                <Scatter data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
