
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);


export default function CountingGraph({process,specification,max,min}){

    const maxValue = 0.2
    const divisor = maxValue >= 0.05? 0.010:0.005
    const quotient = Math.ceil(maxValue/divisor)
    const subdivision = []
    const yAxis = []
    let currentMin = 0
    let currentMax = 0
    console.log('DIVIDER: ',maxValue , divisor, quotient)

    for(let i = 0; i < quotient ; i++){
        currentMax += divisor
        const minPush = currentMin+0.001
        const newMax = currentMax > maxValue ? maxValue: currentMax
        subdivision.push({min:Number(minPush.toFixed(3)),max:Number((newMax - 0.001).toFixed(3))})
        currentMin = currentMax
    }

    Object.entries(subdivision).map((items)=>{
        const minMaxCombine = items[1]
        const labelGraph = minMaxCombine.min.toFixed(3) + ` ~ ` + minMaxCombine.max.toFixed(3)
        yAxis.push(labelGraph)
        console.log('xxx: ',minMaxCombine , minMaxCombine.min , minMaxCombine.max,yAxis,);
    })

    const data = {
        labels: yAxis,
        datasets: [
            {
                label: 'Perpendicularity',
                data: yAxis,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    console.log('counting g',subdivision);
    return(
        <>
            <div  style={{ display:'flex' ,color: '#19232e',justifyContent:'center',flexDirection:'column',width:'40vw', height:'40vh', padding:'2rem', background:'white',borderRadius:'1rem' ,minWidth:'fit-content'}}>
                <h1 style={{ color: '#19232e' }}>{process}&nbsp;{specification}&nbsp;Histogram Chart</h1>
                <p>{maxValue.toFixed(4)}</p>
                <Bar data={data} options={options} />
            </div>
        </>
    )
}
