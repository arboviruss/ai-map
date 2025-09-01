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

       var centerss = ee.Geometry.Point([91.8 - .2, 24.85]);

// Create a circle buffer around the point (units = meters)
       var aoi = centerss.buffer(70000); // 20 km radius

       // Map.addLayer(aoi, {color: 'red'}, 'AOI Circle'); // <-- REMOVE or COMMENT OUT

       var startDate = '2024-06-01';
       var endDate = '2024-07-30';

        var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
            .filter(ee.Filter.eq('instrumentMode', 'IW')) // Interferometric Wide swath
            .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) // Or 'ASCENDING'
            .filterBounds(aoi)
            .filterDate(startDate, endDate);

        var filtered = sentinel1.map(applySpeckleFilter);
        var composite = filtered.median().clip(aoi);

        // Calculate VV/VH ratio (useful for vegetation analysis)
        var ratio = composite.select('VV').divide(composite.select('VH')).rename('VV_VH_ratio');
        composite = composite.addBands(ratio);

        var waterMask = detectWater(composite);

        // Get url format of the image
        // @ts-ignore
        const { urlFormat } = await getMapId(composite, rgbVis);
        const waterBody = await getMapId(waterMask.selfMask(), { palette: 'blue'});

        // Also get the image geometry
        const imageGeom = filtered.geometry();
        const imageGeometryGeojson = await evaluate(imageGeom);

        // @ts-ignore
        res.status(200).json({ main_map: urlFormat, water_body: waterBody.urlFormat, geojson: imageGeometryGeojson });

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
