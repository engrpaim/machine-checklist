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
    const maxMagnet = [1, 2, 3, 4, 5];
    const specsBank = {
        barelling: {
            model: {
                target: model.barelling_target ?? 0, max: model.barelling_max ?? 0, min: model.barelling_min ?? 0
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
        let minimum = 0;
        let diffmax = 0;
        let diffmin = 0;
        let average = 0;
        Object.entries(pointsValue).map(([key, value]) => {
            console.log(key, value);
            average += value / 5;
            value > maximum ? maximum = value : maximum;
            value < minimum || minimum === 0 ? minimum = value : minimum;
            diffmax = specsBank[process]["model"].target - maximum;
            diffmin = specsBank[process]["model"].target - minimum;
        })
        JudgementPoints[items] = {
            p: items,
            average: Number(average.toFixed(3)),
            maximum: maximum.toFixed(3),
            minimum: minimum.toFixed(3),
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
                    p.y <= specsBank[process]["model"].min + .010 || p.y >= specsBank[process]["model"].max - .010 ? 'red' : p.y <= specsBank[process]["model"].min + .015 || p.y >= specsBank[process]["model"].max - .015 ? 'orange' : 'green'
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
                        if (label === 'Point' || label === 'End') return '#0B2F3D'
                        if ((label === 'Magnet 1' || label === 'Magnet 2' || label === 'Magnet 3' || label === 'Magnet 4' || label === 'Magnet 5')

                            && JudgementPoints[number].minimum > specsBank[process]["model"].min && JudgementPoints[number].maximum < specsBank[process]["model"].max) return '#0B2F3D';

                        return 'red'
                    },
                    font: {
                        size: 12,
                        family: 'Poppins',
                        weight: 'bold'
                    },
                },
                grid: { color: '#19728A' },
            },

            y: {
                min: specsBank[process]["model"].min,
                max: specsBank[process]["model"].max,
                ticks: {
                    color: '#0B2F3D',
                    font: {
                        size: 12,
                        family: 'Poppins',
                        weight: 'bold'
                    }
                },
                grid: { color: '#19728A' },
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
    console.log(magnetPoints);
    return (
        <div className='measuring-main'>
            <div>
                <h1>Processing</h1>
            </div>
            <div className='measuring-graph'>
                <div className='measuring-points'>
                    <table className='measuring-process' border={1} style={{ border: '#072940' }}>
                        <thead>
                            <tr>
                                <th colSpan={15} className='titletables' style={{ background: '#1F8BB2', color: '#E9F6FB' }}>ACTUAL DIMENSION</th>

                            </tr>
                            <tr>
                                <td colSpan={15} className='titletables' style={{ background: '#1F8BB2', color: '#E9F6FB' }}>MINIMUM:&nbsp;{specsBank[process]["model"].min}&nbsp;TARGET:&nbsp;{specsBank[process]["model"].target}&nbsp;MAXIMUM:&nbsp;{specsBank[process]["model"].max}</td>
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
                                                        disabled={(status === 'approved' || status === 'measured') && !(edit)}
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
                                                        disabled={(status === 'approved' || status === 'measured') && !(edit)} />
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
                                                        disabled={(status === 'approved' || status === 'measured') && !(edit)} />
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
                                                        disabled={(status === 'approved' || status === 'measured') && !(edit)} />
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
                                                        disabled={(status === 'approved' || status === 'measured') && !(edit)} />
                                                </td>
                                                <td style={{ background: '#FFDCB8' }}>{JudgementPoints[items].maximum ?? null}</td>
                                                <td style={{ color: JudgementPoints[items].maximum > specsBank[process]["model"].min && JudgementPoints[items].maximum < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].maximum ?? null}</td>
                                                <td style={{ color: JudgementPoints[items].minimum > specsBank[process]["model"].min && JudgementPoints[items].minimum < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].minimum ?? null}</td>
                                                <td style={{ fontWeight: "bold" }}>{specsBank[process]["model"].target}</td>
                                                <td>{JudgementPoints[items].diffmax ?? null}</td>
                                                <td>{JudgementPoints[items].diffmin ?? null}</td>
                                                <td style={{ color: JudgementPoints[items].average > specsBank[process]["model"].min && JudgementPoints[items].average < specsBank[process]["model"].max ? null : 'red' }}>{JudgementPoints[items].average ?? null}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div style={{ backgroundColor: '#f5f5f5', width: '35rem', height: '19.5rem', padding: '1rem' }}>
                    <Scatter data={data} options={options} />
                </div>
            </div>
        </div>
    )
}
