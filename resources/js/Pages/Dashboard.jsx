import { usePage } from "@inertiajs/react"
import MainLayout from "../Layouts/MainLayout"
import AllProcess from "../Components/AllProcess"
export default function Dashboard(){
    const {flash , allLot } = usePage().props
    console.log(allLot);
    return(
          <section>
            <div>
                <h1>Dashboard - Machining Checklist</h1>
            </div>
            <div>
                <AllProcess data={allLot}/>
            </div>
          </section>
    )
}

Dashboard.layout = page => <MainLayout>{page}</MainLayout>
