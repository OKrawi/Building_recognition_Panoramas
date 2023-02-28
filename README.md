# Building Recognition Panoramas

This project accesses Google Maps API to get Street View panorma IDs and coordinates in a specific area, then downloads them in a compiled JSON file. 

## Setup

Download the code to your PC.

Get a Google Maps API key from Google.

Create a ".env" file and add the following:

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_GOES_HERE
```

Open file "index.html" and add your key to the bottom script at the specified location. 

## Run
To run the code, open CMD at the location of the files and run the below two commands:

```
npm i
npm start
```
Then open your browser at the specified link in the CMD. 
