import { SettingsIconMinimal,UserIcon,HomeIcon,BarChartIcon } from "../Icons/SVG";
import { useState } from "react";

export default function Navigation(){
    const [isHovered ,setIsHovered] = useState(false);
   return(
        <div className="side-bar">
            <div className="side-upper">
                <div>
                    <UserIcon size={35} color={'#d7fefa'}/>
                </div>

                <nav className="nav-btn">
                    <div className="hoverables"

                    >
                        <a
                          onMouseEnter={()=>setIsHovered('home')}
                          onMouseLeave={()=>setIsHovered(false)}
                          href="/machining-checklist/home"
                        >
                            <HomeIcon color={'currentColor'}/>
                        </a>
                        {isHovered === 'home' && <div className="hover-side">Home</div>}
                    </div>


                    <div className="hoverables">
                        <a
                            onMouseEnter={()=>setIsHovered('checklist')}
                            onMouseLeave={()=>setIsHovered(false)}
                            href="/machining-checklist/measure"><BarChartIcon color={'currentColor'}/></a>
                        {isHovered === 'checklist' && <div className="hover-side">Sheet</div>}
                    </div>
                </nav>
            </div>
            <div className="side-lower">
                <nav>
                    <div className="hoverables">
                         <a
                            onMouseEnter={()=>setIsHovered('settings')}
                            onMouseLeave={()=>setIsHovered(false)}
                            href="/machining-checklist/settings"><SettingsIconMinimal size={25} color={'currentColor'}/></a>
                        {isHovered === 'settings' && <div className="hover-side">Settings</div>}
                    </div>
                </nav>
            </div>
        </div>
   )
}
