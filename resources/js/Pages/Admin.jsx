import MainLayout from "../Layouts/MainLayout"
import { useState } from "react";
import { usePage, Link, useForm } from "@inertiajs/react"
import {AddBoxIcon } from "../Icons/SVG"


export default function Admin(){
    const {modelsList} = usePage().props
    const [model ,setModel] = useState(modelsList.data??null)
    const [modal, setModal] = useState(false);
    console.log('Model: ',modelsList,'Admin model: ',model);


       const { data, setData, post, processing, errors } = useForm({
    firstName: "",
  })

  const submit = (e) => {
    e.preventDefault()

    post("/machining-checklist/admin/models", {
      onSuccess: () => console.log("success"),
    })
  }
    return(
         <section>
            {
                model && modal &&
                (
                    <div className="modal">
                        <div className="details-container-white">
                            <div>
                                <h1>Model Manager</h1>
                            </div>
                            <div>
                                  <form onSubmit={submit}>
                                    <input
                                        value={data.firstName}
                                        onChange={(e) => setData("firstName", e.target.value)}
                                    />

                                    {errors.firstName && <div>{errors.firstName}</div>}

                                    <button disabled={processing}>Submit</button>
                                    </form>
                            </div>
                        </div>
                    </div>
                )
            }
            <div>
                <div>
                    <h1>Admin - Machining Checklist</h1>
                </div>
            </div>
            {/*Admin Panel*/}
            <div className="details-container-white-fit">
                <div >
                    <h1>Model Manager</h1>
                </div>
                <div >
                    <p>User can Add, Update and Delete models.</p>
                </div>
                <div>
                    <button  className="add-btn" onClick={()=>setModal(true)}><AddBoxIcon/></button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Process</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(model).map(([key,value])=>{
                                return(
                                    <tr>
                                        <td>{value.model??'?'}</td>
                                        <td>
                                            <button>Barelling</button>
                                            <button>(T~L) Perpendicularity</button>
                                            <button>Lapping (T)</button>
                                            <button>Slicing (W)</button>
                                        </td>
                                        <td>
                                            <button>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div>
                    {
                        modelsList && modelsList.links.map((link,index)=>(
                            <span key={index}>
                                {
                                    link.url && index!== 0 && index !== modelsList.data.length -1  && (
                                                    <Link
                                                        href={link.url}
                                                        className={link.active ? 'font-bold' : ''}>
                                                        {index}
                                                    </Link>
                                                )
                                }
                            </span>
                        ))
                    }
                </div>
            </div>
         </section>


    )
}

Admin.layout = page => <MainLayout>{page}</MainLayout>
