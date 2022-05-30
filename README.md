# Simple-Sampler

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## technologies

this project uses :

- ReactJS (functional components)
- styled-components
- web-audio api

## description

this web application allows sound recording from any input available to the web browser, It then allows resizing of the 
sample, and the download of the sample as a .wav file

## Using the application

### sampling

- to start recording, press the `start recording` button
- to stop the recording, press the `stop recording` button
- to discard the sample, press the `start recording` button again, and a new sample will be saved, overwritting the last

### cutting

- you can set the start and end points of the sample using the slider at the top of the sample waveform

### replaying

- you can use the player controls at the bottom of the sample waveform to re-play your cut sample (check loop checkbox to make it loop)

### downloading

- you can download the sample by pressing the `download` button, it will start a download for the sample with the name
that was specified in the text input at the right of the download button


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
