// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const ai_story = {
    "story-progress-1": {
        content: `**Yes**, in **2022** Sylhet faced the worst flood in 122 years where **7.2 million people were affected**.
        The region received **1,000 mm rainfall in just 5 days, nearly 5**× the normal level.
        In the map we can see a **blue tint**, this indicates areas that are submerged under water due to floods.`,
        actions: [
            {
                type: 'map',
                function: 'show'
            }
        ]
    },
    "story-progress-2": {
        content: `**The 2022 flood** happened because of Geographical & Rainfall Factors:
        
        **80% of Bangladesh is floodplain**,
        only **10-20 meters** above sea level.
        But when it comes to monsoon rainfall, the average is **2,200 mm annually**, but in **Sylhet
        & Chittagong it can exceed 5,000 mm.**`,
        actions: [
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'flood_water_body_layer', show: true }
            },
            {
                type: 'map',
                function: 'center',
                payload: {
                    location: [24.708705,91.69615390000001],
                    zoom: 10
                }
            },
        ]
    },
    "story-progress-3": {
        content: `There are many factors that contribute to how flooding works such as Geographical and rainfall factors, river system overload, peak flood volume,  soil type and water retention, topography and drainage.`,
        actions: [
            
        ]
    },
    "story-progress-4": {
        content: `River system overload Bangladesh has **405 rivers**, of which **57 are transboundary.**
        **92% of the water entering Bangladesh comes from outside its borders (India, Nepal, Bhutan, China).**
        **The GBM Basin**  also (Ganges-Brahmaputra-Meghna) drains an area of **1.72 million km², but only 7% lies in Bangladesh**, while it carries
        over **1 trillion cubic meters of water annually through Bangladesh.** We can observe the river map of Bangladesh on the left. `,
        actions: [
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'flood_water_body_layer', show: false }
            },
            {
                type: 'map',
                function: 'center',
                payload: {
                    location: [23.65, 90.35],
                    zoom: 7.3
                }
            },
        ]
    },
    "story-progress-5": {
        content: `Yes, Discharge rises dramatically such as,\n
        ‎\n
        Brahmaputra peak discharge: **100,000–110,000 m³/s**\n
        Ganges peak discharge: **70,000–80,000 m³/s**\n
        Meghna peak discharge: **90,000–92,000 m³/s**\n
        When these peaks synchronize,\n\n
        ‎\n
        Bangladesh experiences **major floods covering 30–70%** of the country.\n
        **In 2022,** Sylhet experienced catastrophic floods: **957,448 people were trapped** in floodwaters, and **21,786 took refuge in shelters.**\n 
        ‎\n
        In an emergency like these every second counts. **So we use SAR DATA to find isolated areas to connect rescuers** and **those in danger instantly. 
        The red dot in the map refers** to the **isolated places during the flood.**\n\n
        ‎\n
        We went one step ahead and used **Google Map API** to point and guide people **to the nearest safe destination**. **The tent icon indicates shelters.**
        ‎\n
        We use both **SAR data** and **Google Map API** to differentiate between **safe and submerged roads.**
        In the **map blue roads are safe** and walkable And **red roads are submerged roads.**
        ‎\n
        By using these, local rescuers and NGOs can help people as soon as the flood strike, can give early warning delivery, and scale to all flood areas.
        SAR-based water detection can predict inundation zones at least 48 hours earlier than current reporting.
        ‎\n
        Bangladesh’s increasing flood vulnerability is strongly linked to the decline in its natural water retention systems. Historically, wetlands, floodplains, and clay-rich soils acted as buffers, storing excess monsoon rainfall.`,
        actions: [
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'flood_water_body_layer', show: true }
            },
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'isolated_places_layer', show: true }
            },
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'safe_locations_layer', show: true }
            },
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'roads_layer', show: true }
            },
            {
                type: 'map',
                function: 'layer',
                payload: { layer: 'flooded_roads_layer', show: true }
            },
            {
                type: 'map',
                function: 'center',
                payload: {
                    location: [24.708705,91.69615390000001],
                    zoom: 10
                }
            },
        ]
    },
    "story-progress-6": {
        content: `**Urban areas in Sylhet** have grown by **approximately 300%,** while water bodies have **diminished by about 77%,** reflecting trends of urbanization and river-filling.
        Studies indicate a **decrease in groundwater levels in Sylhet**, with a **22% increase in water table depth** observed by the end of 1985 And naturally the moisture retention ability 
        Decreased significantly. On the left we can see the back scatter and **wet land  with polarisation**`
    },
    "story-progress-7": {
        content: `Due to rapid urbanization, **deforestation** in tea garden belts, **wetland loss**, and **soil compaction** from intensive farming have reduced this capmapping.\n
        ‎\n
        We hypothesize that by leveraging **Synthetic Aperture Radar (SAR)** data specifically **soil moisture indices**, **multi-polarization backscatter**, and **wetland mapping**.\n
        ‎\n
        On the left, Through **Sentinel-1** we can observe Bangladesh's  SAR analysis where\n
        ‎\n
        **Dark Blue** = Permanent  Wet lands\n
        **Light Blue** = seasonal wet land\n
        ‎\n
        **Blue** = high soil moisture,\n
        **Red** = low soil moisture\n
        ‎\n
        One the first photo we can detect VV back scatter,  
        The second one indicates Vh wet land. 
        On the third frame we can see a probability of wet land.
        While the 4 th one lets us observes soil moisture.`,
        actions: []
    },
    "story-progress-8": {
        content: `While enabling rapid disaster assessment by identifying **flood zones**, **landslides**, and **damaged infrastructure**. This allows emergency teams to allocate resources efficiently, ultimately improving rescue outcomes and **reducing casualties** and **property damage.**`
    },
    "story-progress-9": {
        content: `**Providing timely and accurate information, the SAR data helps reduce economic losses through better disaster preparedness.** It supports urban and agricultural planning by informing decisions on **land use**, **farming**, and **infrastructure development**.\n
        ‎\n
        **Thank you, curious homman!**\n
        Hope your curious head got an itch.\n
        **Thank you!**\n
        `
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    // const completion = await ai.chat.completions.create({
    //     model: 'gemini-2.5-flash-lite-preview-06-17',
    //     messages: [
    //       { role: 'developer', content: 'Talk like a pirate.' },
    //       { role: 'user', content: 'Are semicolons optional in JavaScript?' },
    //     ],
    // });

    // const response = completion.choices[0].message.content;
    const { id } = req.body;

    // @ts-ignore
    let response = ai_story[id].content
    // @ts-ignore
    let actions = ai_story[id].actions ? ai_story[id].actions : []
    
    res.status(200).json({ id: `${Date.now()}-${Math.random()}`, text: response, sender: 'ai', actions });
}
