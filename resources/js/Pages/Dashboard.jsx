import { usePage } from "@inertiajs/react"
import { useState } from "react"
import MainLayout from "../Layouts/MainLayout"
import AllProcess from "../Components/AllProcess"
export default function Dashboard(){
    const {flash , allLot , ip_client ,modelsList} = usePage().props
    const [clientIp,setClientIp] = useState(ip_client);
    console.log(allLot,flash,'Modelx: ',modelsList);
    return(
          <section>
            <div>
                <h1>Dashboard - Machining Checklist</h1>
            </div>
            <div>
                <AllProcess data={allLot} clientIp={clientIp} model={modelsList}/>
            </div>
          </section>
    )
}

Dashboard.layout = page => <MainLayout>{page}</MainLayout>
