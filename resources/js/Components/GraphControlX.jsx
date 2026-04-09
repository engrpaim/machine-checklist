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

export default function GraphControlX({XAverage}){

    const xdata = [null]
    const averageX =  XAverage ? XAverage:null
    const xmerge = averageX ? [ ...xdata , ...averageX] :null
   const data = {
        labels: ['Value','1', '2', '3', '4', '5','6','7','8','9','End'],
        datasets: [
            {
                label: 'X Bar',
                data: xmerge,
                textColor:'red',
                borderColor: 'blue',
                borderWidth: 1,
                pointStyle: 'rectRot',
                pointRadius: 5,
                 tension: 0.5,
                pointBackgroundColor: (context)=>{
                    console.log(context , context.dataIndex);
                    if(context.dataIndex <= 0 )return
                     console.log('not 1');
                    const color =context.raw >= 16.300 && context.raw <= 16.314 ? '#142E90':'red'
                    return  color
                },
                segment:{
                     borderColor: (ctx) => {
                        console.log('SEGMENT' ,ctx);
                        for(let i = 0 ; i < xmerge.length ; i++){
                            if(!ctx[`p${i}`])return
                            const currentPoint = ctx[`p${i}`].raw
                            const nextPoint = ctx[`p${i+1}`].raw ? ctx[`p${i+1}`].raw : 0

                            return currentPoint >= 16.300 && currentPoint <= 16.314 && (nextPoint >= 16.300 && nextPoint <= 16.314 || 0) ? '#142E90':'red'

                        }
                     }
                }
            },
        ],
    };

const options = {
    scales: {
        y: {
            min: 16.275,
            max: 16.325,
        },
    },

    plugins: {
        tooltip: {
            callbacks: {
                label: (context) => {
                    return `Magnet  ${context.label}: ${context.raw}`;
                },
                title: (context) => {
                    return 'Point Average';
                },
            },
        },
        legend: {
            labels: {
                usePointStyle: true,
            },
        },
        datalabels: {
            color:(context)=>{
                    console.log('Color',context , context.dataIndex);
                    if(!xmerge) return
                    if(!context.dataIndex) return
                    const index = context.dataIndex
                    const data = xmerge[index]

                    return data >= 16.300 && data <= 16.314 && data >= 16.300 && data <= 16.314 ? '#142E90':'red'
                },
            anchor: 'start',
            align: 'top',

        },
        annotation: {

            annotations: {
                minLine: {
                    type: 'box',
                    yMin: 16.280,
                    yMax: 16.300,
                    borderColor: 'rgba(255, 137, 4,.1)' ,
                    backgroundColor:'rgba(255, 137, 4,.1)' ,
                    borderWidth: 2,
                    label: {
                        display: true,
                        content: 'MIN',
                        position: 'end',
                        color:'#753F00',
                        align:'bottom'
                    },
                },
                maxLine: {
                    type: 'box',
                    yMin: 16.315,
                    yMax: 16.320,
                    borderColor: 'rgba(255, 137, 4,.1)' ,
                    backgroundColor:'rgba(255, 137, 4,.1)' ,
                    borderWidth: 2,
                    label: {
                        display: true,
                        content: 'MAX',
                        align:'top',
                        color:'#753F00',
                        position: 'end',
                    },
                },
                targetLine: {
                    type: 'box',
                    yMin: 16.300,
                    yMax: 16.315,
                    borderColor: 'green',
                    backgroundColor:'rgba(5, 223, 114,.1)',
                    borderDash: [6, 6],
                    index:1000,
                    borderWidth: 2,
                    label: {
                        display: true,
                        content: 'TARGET',
                        position: 'end',
                        color:'#011912'
                    },
                },
            },
        },
    },
};


    return(
        <>
           <div className='details-container-white' style={{ width:'50rem', height:'30rem' }}>
                <h1>X Graph</h1>
                <Line data={data} options={options} style={{ width:'100%' ,height:'100%' , margin:'2rem'}} />
           </div>
        </>
    )
}
