
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


export default function CountingGraph({process,specification,max,min,perpendicularity,maxperpen}){
     console.log('COUNTING PERPEN DATA: ',perpendicularity)
    const maxValue = Number(maxperpen)
    const divisor = maxValue >= 0.05? 0.010:0.005
    const quotient = Math.ceil(maxValue/divisor)
    const subdivision = []
    const yAxis = []
    const maxPerpenDicularity ={}
    let currentMin = 0
    let currentMax = 0
    let maxPointValue = 0
    const colorMap = ['#FF6467','#FE9A37','#31C950','#3BB8DB','#615FFF','#FDC745','#615FFF','#FFDF20','#FF637E','#F9068C']
    console.log('DIVIDER: ',maxValue , divisor, quotient)

    //compute for the subdivision of max
    for(let i = 0; i < quotient ; i++){
        currentMax += divisor
        const minPush = currentMin+0.001
        let newMax = currentMax > maxValue ? maxValue: currentMax
        newMax = newMax === maxValue?  maxValue - 0.001 :newMax
        subdivision.push({min:Number(minPush.toFixed(3)),max:Number((newMax).toFixed(3))})
        i === quotient - 1 ?  subdivision.push({min:Number(maxValue),max:9999}):null
        currentMin = currentMax
    }


    //return label for x axis
    Object.entries(subdivision).map((items)=>{
        const minMaxCombine = items[1]
        const labelGraph = minMaxCombine.min.toFixed(3) + ` ~ ` + minMaxCombine.max.toFixed(3)
        yAxis.push(labelGraph)
        console.log('xxx: ',minMaxCombine , minMaxCombine.min , minMaxCombine.max,yAxis,);
    })

    //map grap average value per points of magnet
    if(perpendicularity){
        Object.entries(perpendicularity).map(([key,value])=>{
            let currentMaxPoint = 0;
            let graphIndex = null;
            let currentData =[]
            let colorSet='';
            console.log('[CGHL] Counting key and value pair: ', key, value);


            Object.entries(value).map(([keyPoint,keyValue])=>{
                console.log('[CGHL] Get max value: ', keyPoint, keyValue , 'Magnet Numbher: ',key,'Current Max: ',currentMaxPoint);
                if(keyValue !== null){
                currentMaxPoint = Number(keyValue) > currentMaxPoint ?  Number(keyValue):Number(currentMaxPoint)

                //const graphIndex = currentMaxPoint >= maxValue ? maxValue.length - 1 :null
                Object.entries(subdivision).map(([insideKey,insideValue])=>{
                    console.log('data cghl: ',insideKey , insideValue.min ,insideValue.max,currentMaxPoint,currentMaxPoint >= insideValue.min && currentMaxPoint <= insideValue.max);
                    currentData.push(currentMaxPoint >= insideValue.min && currentMaxPoint <= insideValue.max?  graphIndex =  1:null)
                    currentMaxPoint >= insideValue.min && currentMaxPoint <= insideValue.max && currentMaxPoint < maxValue?colorSet = colorMap[key]: currentMaxPoint >= maxValue? colorSet= 'red':null
                })

                maxPerpenDicularity[key]= {label:`Magnet ${key}`, data:currentData,backgroundColor:colorSet}
                currentData =[]
                }
            })
        })
    }

    // stacked bar graph data,settings and design
    const data = {
        labels: yAxis,
        datasets: Object.values(maxPerpenDicularity)
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                backgroundColor: '#4CAF50'
            }
        },

        scales: {
            x: {
                    stacked: true,
                },
            y: {
                min: 0,
                max:10,
                 stacked: true
            }
        }
    };

    console.log('counting g: ',subdivision, ' max average: ',maxPerpenDicularity);
    return(
        <>
            <div  style={{ display:'flex' ,color: '#19232e',justifyContent:'center',flexDirection:'column',width:'40vw', height:'40vh', padding:'2rem', background:'white',borderRadius:'1rem' ,minWidth:'fit-content'}}>
                <h1 style={{ color: '#19232e' }}>{process}&nbsp;{specification}&nbsp;Histogram Chart</h1>
                <p>Max{Number(maxValue).toFixed(3)}</p>
                <Bar data={data} options={options} />
            </div>
        </>
    )
}
