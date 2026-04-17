import {
    Chart as ChartJS,
    PointElement,
    LineElement,
    LinearScale,
    Tooltip,
    CategoryScale,
    Legend,
    plugins,
    scales,
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
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

export default function GraphControlR({data , min , max}){

    const maxCurrent = max? Number(max.toFixed(3)) : 0
    const minCurrent = min ?Number(min.toFixed(3)) : 0
    const mergeData =[...[null],...data,...[null]]
    console.log('Graph R: ',mergeData,min);
    const dataset = {
        labels: ['Value','1', '2', '3', '4', '5','6','7','8','9','End'],
        datasets: [
            {
                label: 'R point',
                data: mergeData,
                textColor:'red',
                borderColor: 'blue',
                borderWidth: 1,
                pointBackgroundColor:'blue',
                pointStyle: 'rectRot',
                pointRadius: 5,
                tension:0,
            },
        ],
    };
    const options = {
        scales: {
            y: {
                min: minCurrent + 0.01 ,
                max:  maxCurrent - 0.02,
            },
        },

        plugins:{
            datalabels: {
                color:'blue',
                anchor: 'start',
                align: 'top',
            },
            legend: {
                labels: {
                    usePointStyle: true,
                    pointBackgroundColor:'blue',
                },
            },
            annotation: {
                annotations: {

                    minLine: {
                        type: 'line',
                        yMin: minCurrent,
                        yMax: minCurrent,
                        borderColor: 'green' ,
                        borderWidth: 2,
                    },

                    maxLine: {
                        type: 'line',
                        yMin: maxCurrent,
                        yMax: maxCurrent,
                        borderColor: 'red',
                        borderWidth: 2,
                    },

                },
            },
        }
    }
    return(
        <div  style={{ display:'flex',justifyContent:'center',flexDirection:'column',width:'40vw', height:'40vh', padding:'2rem', background:'white',borderRadius:'1rem' ,minWidth:'fit-content'}}>
            <h1 style={{ justifySelf:'start' ,color: '#19232e'}}>R Graph</h1>
            <Line data={dataset} options={options} style={{ width:'40vw' ,height:'35vh' }} />
        </div>
    )
}
