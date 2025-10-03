// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

var ee = require('@google/earthengine');

type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        let serviceAccount = JSON.parse(process.env['GOOGLE_SERVICE_ACCOUNT'] || "{}")
        await authenticate(serviceAccount);

        var bangladesh = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
            .filter(ee.Filter.eq('country_na', 'Bangladesh'));

        const bdBorder = await getMapId(bangladesh, {color: 'black', fillColor: '00000000'});

        // ===== METHOD 1: JRC Global Surface Water - Most Comprehensive =====
        var water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').clip(bangladesh);
        var occurrence = water.select('occurrence');

        // All water bodies (even if present only 10% of time to catch small rivers)
        var allWater = occurrence.gt(10);

        const allWaterLayer = await getMapId(allWater.updateMask(allWater), {palette: ['#e0f3ff']});

        var smallRivers = occurrence.gt(10).and(occurrence.lte(40));
        const smallWaterRivers = await getMapId(smallRivers.updateMask(smallRivers), {palette: ['#a8daff']})

        var mediumRivers = occurrence.gt(40).and(occurrence.lte(70));
        const mediumWaterRivers = await getMapId(mediumRivers.updateMask(mediumRivers), {palette: ['#4da6ff']})

        // Major rivers (>70% occurrence)
        var majorRivers = occurrence.gt(70);
        const majorWaterRivers = await getMapId(majorRivers.updateMask(majorRivers), {palette: ['#0066cc']})

        var permanentRivers = occurrence.gt(90);
        const permanentWaterRivers = await getMapId(permanentRivers.updateMask(permanentRivers), {palette: ['#003d7a']})

        var allWaterGradient = {
            min: 10,
            max: 100,
            palette: ['#e0f3ff', '#a8daff', '#4da6ff', '#0066cc', '#003d7a']
        };



        res.status(200).json({
            // @ts-ignore
            bd_border: bdBorder.urlFormat,
            // @ts-ignore
            water_layer: allWaterLayer.urlFormat,
            // @ts-ignore
            small_water_rivers: smallWaterRivers.urlFormat,
            // @ts-ignore
            medium_water_rivers: mediumWaterRivers.urlFormat,
            // @ts-ignore
            major_water_rivers: majorWaterRivers.urlFormat,
            // @ts-ignore
            permanent_water_rivers: permanentWaterRivers.urlFormat
        })

    } catch(err) {

        // @ts-ignore
        res.status(500).json({ error: err.message })

    }
    
    res.status(200).json({ name: "John Doe" });
}

function authenticate(key: { type: string; project_id: string; private_key_id: string; private_key: string; client_email: string; client_id: string; auth_uri: string; token_uri: string; auth_provider_x509_cert_url: string; client_x509_cert_url: string; universe_domain: string; }) {
    return new Promise<void>((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(
            key,
            () =>
            ee.initialize(
                null,
                null,
                () => resolve(),
                (error: string | undefined) => reject(new Error(error))
            ),
            (error: string | undefined) => reject(new Error(error))
        );
    });
}

function applySpeckleFilter(image: { select: (arg0: string) => { (): any; new(): any; focal_median: { (arg0: number, arg1: string, arg2: string): any; new(): any; }; }; addBands: (arg0: any) => { (): any; new(): any; addBands: { (arg0: any): any; new(): any; }; }; }) {
    var vv = image.select('VV').focal_median(50, 'circle', 'meters');
    var vh = image.select('VH').focal_median(50, 'circle', 'meters');
    return image.addBands(vv.rename('VV_filtered'))
                .addBands(vh.rename('VH_filtered'));
}

function detectWater(image: { select: (arg0: string) => { (): any; new(): any; lt: { (arg0: number): any; new(): any; }; }; }) {
    var water = image.select('VV').lt(-15); // Threshold for water (adjust as needed)
    return water.rename('water_mask');
}

var rgbVis = {
    min: [-25, -30, -25],
    max: [0, -5, 0],
    bands: ['VV', 'VH', 'VV']
};

/**
     * Function to get the image tile url
     * This function is also for no callback
     * @param {ee.Image} image
     * @param {{ min: [number, number, number], max: [number, number, number], bands: [string, string, string]}}
     * @returns {Promise<{urlFormat: string}>} Will return the object with key urlFormat for viewing in web map
 */
function getMapId(image: { getMapId: (arg0: any, arg1: (obj: any, error: any) => void) => void; }, vis: any) {
    return new Promise((resolve, reject) => {
      image.getMapId(vis, (obj, error) =>
        error ? reject(new Error(error)) : resolve(obj)
      );
    });
  }
  
/**
   * Function to get an actual value of an ee object
   * @param {any} obj
   * @returns {any}
*/
function evaluate(obj: { evaluate: (arg0: (result: any, error: any) => void) => void; }) {
    return new Promise((resolve, reject) =>
      obj.evaluate((result, error) =>
        error ? reject(new Error(error)) : resolve(result)
      )
    );
}
