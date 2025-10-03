'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"

function Welcome() {
    return (
        <>
            Hi! I'm Sara, 
            <br />
            your guide to NASA's SAR data for flood research in Sylhet, Bangladesh. I can help you explore how
            this data tracks floods before, during, and after events in this flood-prone region.
            <br />
            <br />
            Want me to explain 
            SAR data or show a map of Sylhet's flood areas? Let me know!
        </>
    )    
}

function WelcomeButtons() {
    // return (
    //     <div className="flex gap-2 mt-2 ml-1">
    //         <Badge>
    //             Button 1
    //         </Badge>
    //         <Badge>
    //             Button 2
    //         </Badge>
    //     </div>
    // )
    return (
        <></>
    )
}

export default Welcome;
export { WelcomeButtons }


