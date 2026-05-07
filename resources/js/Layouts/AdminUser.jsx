import {AddBoxIcon , CrossIcon } from "../Icons/SVG"
export default function AdminUser({modelDetails,setModeltails,handleKeyDown,handleClose,preview,processingModel,fileInputRef,handleUpload ,submit}){
    return(
        <section>
            <div className="modal">
                        <div className="details-container-white">
                            <div style={{ alignSelf:'flex-end'}}>
                               <button className="close-btn" onClick={()=>handleClose()}><CrossIcon/></button>
                            </div>
                            <div>
                                <h1>Create Model</h1>
                            </div>
                            <form className="form-data" onSubmit={
                                                                    (e)=> {

                                                                            submit(e,'model');

                                                                          }
                                                                  }   style={{ display: "flex", flexDirection: "column" }}>

                                <div>
                                    <div>
                                        <div>
                                            <div className="modal-input">
                                                <label>Model:</label>
                                                <input
                                                    value={modelDetails.model}
                                                    onChange={(e)=>setModeltails('model',e.target.value)}
                                                    onKeyDown={(e)=>handleKeyDown(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-row">
                                            <div>
                                                <div>
                                                    <h1>CGHL L</h1>
                                                </div>
                                                <div>
                                                    <div className="modal-input">
                                                        <label>CGHL points:</label>
                                                        <input  type="number"
                                                            value={modelDetails.cghl_points}
                                                            onChange={(e)=>setModeltails('cghl_points',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>CGHL target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.cghl_target}
                                                            onChange={(e)=>setModeltails('cghl_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>CGHL minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.cghl_min}
                                                            onChange={(e)=>setModeltails('cghl_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>CGHL maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.cghl_max}
                                                            onChange={(e)=>setModeltails('cghl_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Lapping T</h1>
                                                    <div className="modal-input">
                                                        <label>Lapping T points:</label>
                                                        <input  type="number"
                                                            value={modelDetails.lapping_points}
                                                            onChange={(e)=>setModeltails('lapping_points',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Lapping T target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.lappingt_target}
                                                            onChange={(e)=>setModeltails('lappingt_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Lapping T minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.lappingt_min}
                                                            onChange={(e)=>setModeltails('lappingt_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Lapping T maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.lappingt_max}
                                                            onChange={(e)=>setModeltails('lappingt_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Slicing Data*/}
                                            <div>
                                                <div>
                                                    <h1>Slicing</h1>
                                                </div>
                                                <div>
                                                    <div className="modal-input">
                                                        <label>Slicing points:</label>
                                                        <input  type="number"
                                                            value={modelDetails.slicing_points}
                                                            onChange={(e)=>setModeltails('slicing_points',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Slicing target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.slicing_target}
                                                            onChange={(e)=>setModeltails('slicing_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Slicing minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.slicing_min}
                                                            onChange={(e)=>setModeltails('slicing_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Slicing maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.slicing_max}
                                                            onChange={(e)=>setModeltails('slicing_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Histogram</h1>
                                                    <div className="modal-input">
                                                        <label>Flatness:</label>
                                                        <input  type="number"
                                                            value={modelDetails.flatness_lapping}
                                                            onChange={(e)=>setModeltails('flatness_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Height:</label>
                                                        <input  type="number"
                                                            value={modelDetails.height_lapping}
                                                            onChange={(e)=>setModeltails('height_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                     <div className="modal-input">
                                                        <label>Perpendicularity:</label>
                                                        <input  type="number"
                                                            value={modelDetails.perpendicularity}
                                                            onChange={(e)=>setModeltails('perpendicularity',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Parallelism:</label>
                                                        <input  type="number"
                                                            value={modelDetails.parallelism_lapping}
                                                            onChange={(e)=>setModeltails('parallelism_lapping',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <h1>Barelling</h1>
                                                    <div className="modal-input">
                                                        <label>Barelling points:</label>
                                                        <input  type="number"
                                                            value={modelDetails.point}
                                                            onChange={(e)=>setModeltails('point',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.barelling_target}
                                                            onChange={(e)=>setModeltails('barelling_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.barelling_min}
                                                            onChange={(e)=>setModeltails('barelling_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Barelling maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.barelling_max}
                                                            onChange={(e)=>setModeltails('barelling_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            ></input>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Barelling Data*/}
                                            <div>
                                                <div>
                                                    <h1>Barelling Chamfering</h1>
                                                    <div className="modal-input">
                                                        <label>Chamfer Points:</label>
                                                        <input  type="number"
                                                            max="2"
                                                            value={modelDetails.chamfer_points}
                                                            onChange={(e)=>setModeltails('chamfer_points', Number(e.target.value) <= 1? 1: Number(e.target.value) > 2?2:e.target.value )}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <br/>
                                                    <p>Point 1</p>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_target}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_target',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_min}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_min',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_max}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_max',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <br/>
                                                     <p>Point 2</p>
                                                     <div className="modal-input">
                                                        <label>Chamfering Barelling target:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_target2}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_target2',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling minimum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_min2}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_min2',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfering Barelling maximum:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_barelling_max2}
                                                            onChange={(e)=>setModeltails('chamfer_barelling_max2',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}></input>
                                                    </div>
                                                    <div className="modal-input">
                                                        <label>Chamfer Type:</label>
                                                        <input  type="number"
                                                            value={modelDetails.chamfer_type}
                                                            onChange={(e)=>setModeltails('chamfer_type',e.target.value)}
                                                            onKeyDown={(e)=>handleKeyDown(e)}
                                                            disabled={true}
                                                            ></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-row picture-container">
                                {
                                    modelDetails && modelDetails.chamfer_points ?
                                    Array.from({ length: modelDetails.chamfer_points }).map((_, i) => (
                                        <div className="upload-container-row">
                                            <div    className="drop-zone"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onClick={() => fileInputRef.current[`point${i+1}`].click()}
                                                    onDrop={(e) => handleDrop(e, i+1)}>
                                                <div>
                                                    <p style={{ fontWeight:'bold' , fontStyle:'italic' }}>Chamfering Point {i+1}</p>
                                                    <input id={`file-${i}`} ref={(el) => fileInputRef.current[`point${i+1}`] = el} type="file" accept="image/*" className="upload-input" onChange={(e)=>handleUpload(e,i+1)} idName="fileInput" hidden />
                                                </div>
                                                <div className="upload-container">
                                                    <div className="pictures-preview" style={{ width: "13rem" , height:"10rem"}}>
                                                        {
                                                            preview && preview[`chamfer_point${i+1}_data`] && <img src={preview[`chamfer_point${i+1}_data`]} alt="preview" style={{ width: "13rem" , height:"10rem"}}/>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )): <div    className="drop-zone" style={{ display:'flex' , alignItems:'center' , justifyContent:'center' , width: "13rem" , height:"12rem" }}> No Photo needed</div>
                                }
                                </div>
                                <button className="success-theme" style={{ alignSelf:'flex-end' }} disabled={processingModel}>Submit</button>
                            </form>
                        </div>
                    </div>
        </section>
    )
}
