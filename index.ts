// Initialize variables
let map: google.maps.Map;
let panorama: google.maps.StreetViewPanorama;

interface Pano{
  panoId: string,
  lat: string,
  lng: string
}

const panos: Pano[] = [];
const panoIds: string[] = [];

// Initialize the map
function initMap(): void {
  // Set the scanning range
  const startLat = 41.0100;
  const endLat = 41.0130;
  const startLng = 28.6660;
  const endLng = 28.6690;
  const sv = new google.maps.StreetViewService();

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano") as HTMLElement
  );

  // Set up the map and center it at the center of the scanning reigon
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: (endLat+startLat)/2, lng: (endLng+startLng)/2 },
    zoom: 16,
    streetViewControl: false,
  });

  // Scan the specified reigon and handle the discovered panoramas 
  let currentLat = startLat;
  while(currentLat <= endLat){
    let currentLng = startLng;
    while(currentLng <= endLng){
      let currentLocation = { lat: currentLat, lng: currentLng}
      sv.getPanorama({ location: currentLocation, radius: 50 }).then(processSVData);
      currentLng = currentLng + 0.0001;
    }
    currentLat = currentLat + 0.0001;
  }

  // Look for a nearby Street View panorama when the map is clicked.
  map.addListener("click", (event) => {
    sv.getPanorama({ location: event.latLng, radius: 50 })
      .then(processSVData)
      .catch((e) =>
        console.error("Street View data not found for this location.")
      );
  });
}

function processSVData({ data }: google.maps.StreetViewResponse) {
  // Initialize variables
  const newPanoId = data.location?.pano;
  let isNew = false;

  // Add new panoramas to the pano array.
  if(newPanoId){
    panoIds.indexOf(newPanoId) === -1 ? isNew = true : null;
    if(isNew){
      panoIds.push(newPanoId); 

      const newPano:Pano = {
        lat: String(data.location?.latLng?.lat()),
        lng: String(data.location?.latLng?.lng()),
        panoId: newPanoId
      }

      panos.push(newPano);

      // Create markers on the map for every panorama
      const location = data.location!;
      const marker = new google.maps.Marker({
        position: location.latLng,
        map,
        title: location.description,
      });
  
      // Set the Pano to use the passed panoID.
      marker.addListener("click", () => {
        const markerPanoID = location.pano;  
        panorama.setPano(markerPanoID as string);
        panorama.setPov({
          heading: 270,
          pitch: 0,
        });
        panorama.setVisible(true);
      });
    }
  }
}

// Initialize the map at start
declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

// TODO: find a better way to check if the process is finished.
setTimeout(saveJson, 10000);

// Save the panos array as a JSON file
function saveJson(){
  const jsonData = JSON.stringify(panos);
  download(jsonData, 'panos.json', 'json');
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}


export {};
