import '../../css/common.css';
import { removeUnwanted } from '../utils/UtilityFunctions';
import { useState } from 'react';
import { InfoIcon } from '../Icons/SVG';
export default function CommonDetails({data, setData,handleStore,processing}){
    const firstPart = ['Lot Number' , 'Operator Name', 'Checker' ]
    const secondPart = ['Shift','Date','Staff/Engineer']

    console.log('Component Common Detials: ',data);
    return(
        <div className="details-container-gray">
            <h1>Processing Details</h1>
            <div className='details-container-inner'>
                <div className="details-part">
                    {
                        firstPart.map((details,index)=>{
                            const cleanData = removeUnwanted(details);
                            const currentValue =  data[cleanData];
                            return(
                                <div className="details-data" key={index}>
                                    <label >{details}&nbsp;:</label>
                                    <input id={cleanData} value={currentValue ? currentValue:''} onChange={(e)=> setData(cleanData,e.target.value)}/>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="details-part">
                    {
                        secondPart.map((details,index)=>{
                            const isDisabled = details === 'Shift' || details === 'Date' ? true:false;
                            const hourFormat  = new Date();

                            const formattedTime24 = new Intl.DateTimeFormat('en-GB',{
                                    hour:'numeric',
                                    hour12:false
                                }).format(hourFormat);


                            const shift = formattedTime24 > 6 && formattedTime24 < 18 ? 'E' :'F'
                            const currentDate = hourFormat.toISOString().slice(0,10) ;
                            const dateShift = details === 'Shift'  ? shift:details === 'Date'?currentDate :null;
                            const cleanData = removeUnwanted(details);
                            const currentValue =  details === 'Shift' || details === 'Date' ? dateShift :data[cleanData];

                            if(!data.shift){
                                setData('shift' , shift);
                                setData('date' , currentDate);
                            }

                            return(
                                <div className="details-data" key={index}>
                                    <label>{details}&nbsp;:</label>
                                    <input
                                        id={cleanData}
                                        disabled={isDisabled}
                                        value={currentValue ? currentValue:''}
                                        onChange={(e)=> setData(cleanData,e.target.value)}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='inside-data-center'>
                <button type='button' className='inside-btn' onClick={(e)=>handleStore()}  disabled={processing}>   {processing ? 'Preparing...' : 'Prepare'}</button>
            </div>
        </div>
    )
}
