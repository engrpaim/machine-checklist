import { InfoIcon } from "../Icons/SVG"
export default function BarellingDetails(){
    const firstPart = ['Total Batch/Lot' , 'Total Qty/Lot', 'Total Wt./Lot' ,'Media Size' ]
    return(
        <>
            <div className="details-container-gray">
                <h1>Barelling Details</h1>
                <div className="details-container-inner">
                    <div className="details-part">
                        <div className="details-data">
                            <label>Batch Number:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>Total Batch/Lot:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>Total Qty/Lot:</label>
                            <input/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Media Size:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>Media Weight:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>Coolant Level:</label>
                            <input/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>Styrene Powder:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>GC Powder:</label>
                            <input/>
                        </div>
                        <div className="details-data">
                            <label>Magnet wt/pc.:</label>
                            <input/>
                        </div>
                    </div>
                    <div className="details-part">
                        <div className="details-data">
                            <label>chamfertype:</label>
                            <input/>
                        </div>
                    </div>
                </div>
                <div className="information">
                    <InfoIcon size={15}/>
                    <p><i>Automatic Saving feature.</i></p>
                </div>
            </div>
        </>

    )
}
