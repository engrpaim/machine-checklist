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

export default function GraphControlX({XAverage,model}){
    console.log('Graph x: ',model);
    const xdata = [null]
    const averageX =  XAverage ? XAverage:null
    const xmerge = averageX ? [ ...xdata , ...averageX] :null
    const data = {
        labels: ['Value','1', '2', '3', '4', '5','6','7','8','9','End'],
        datasets: [
            {
                label: 'Good',
                data: xmerge,
                textColor:'blue',
                borderWidth: 1,
                pointStyle: 'rectRot',
                pointRadius: 5,
                tension:0,
                pointBackgroundColor: (context)=>{
                    console.log(context , context.dataIndex);
                    if(context.dataIndex <= 0 )return 'blue'

                    const color = context.raw >= model.cghl_target && context.raw <= model.cghl_max - 0.005 ? 'blue': (context.raw <= model.cghl_target && context.raw >= model.cghl_min) || (context.raw > model.cghl_max - 0.005 && context.raw < model.cghl_max) ?'orange':'red'
                    return  color
                },
                segment:{
                     borderColor: (ctx) => {
                        console.log('SEGMENT' ,ctx);
                        for(let i = 0 ; i < xmerge.length ; i++){
                            if(!ctx[`p${i}`])return
                            const currentPoint = ctx[`p${i}`].raw
                            const nextPoint = ctx[`p${i+1}`].raw ? ctx[`p${i+1}`].raw : 0

                            return currentPoint >= model.cghl_target && currentPoint <= model.cghl_max - 0.005 && (nextPoint >= model.cghl_target && nextPoint <= model.cghl_max -0.005 || 0) ? '#142E90':'red'

                        }
                     }
                }
            },{
                label: 'Reject',
                pointStyle: 'rectRot',
                backgroundColor: 'red'
            },
            {
                label: 'Adjust',
                pointStyle: 'rectRot',
                backgroundColor: 'orange'
            },
        ],
    };

const options = {
    scales: {
        y: {
            min: model.cghl_min - 0.005,
            max: model.cghl_max + 0.005,
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

                    return data >= model.cghl_target && data <= model.cghl_max - 0.005 && data >= model.cghl_target && data <= model.cghl_max -0.005 ? '#142E90'
                                : (context.raw < model.cghl_target ||  context.raw > model.cghl_max - 0.005 ) && (context.raw < model.cghl_max || context.raw > model.cghl_min ) ?'orange'
                                :'red'
                },
            anchor: 'start',
            align: 'top',

        },
        annotation: {

            annotations: {
                minLine: {
                    type: 'box',
                    yMin: model.cghl_min,
                    yMax: model.cghl_target,
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
                    yMin: model.cghl_max,
                    yMax:model.cghl_target ,
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
                    yMin: model.cghl_max - 0.005,
                    yMax: model.cghl_target,
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
           <div  style={{ display:'flex',justifyContent:'center',flexDirection:'column',width:'40vw',minWidth:'fit-content', height:'40vh',padding:'2rem' , background:'white',borderRadius:'1rem'}}>
                <h1 style={{ justifySelf:'start' ,color: '#19232e'}}>X Graph</h1>
                <Line data={data} options={options} style={{ width:'40vw' ,height:'35vh' }} />
           </div>
        </>
    )
}
