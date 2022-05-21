# MQTT-scale-reader frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## technologies

this project use :

- ReactJS (functional components)
- Websockets
- styled-components

## description

this web application uses react JS to provide a tool to test the correct configuration of the BOXY qrcode-reader

## Using the application

this web app only has a single page

this page accepts 1 url parameters : 

- `wsUrl` -> url of the websocket server the app will connect to

they can be formated as : 

```
http://localhost:3000?wsUrl=ws://localhost:8765
```

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
