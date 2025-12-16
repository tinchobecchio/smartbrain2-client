import { useState } from 'react';
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const returnClarifaiReqOpt = (imageURL) => {
  
  const PAT = 'd15812c4998344188ad1449d076d2488';
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const IMAGE_URL = imageURL;
  
  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
  
  return requestOptions
}
const CLARIFAI_URL = `https://api.clarifai.com/v2/models/face-detection/outputs`
const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // esto es para que no salga el CORS despues sacarselo cuando haga la peticion desde el server ------------


function App() {
  const [ input, setInput ] = useState('')
  const [ imgURL, setImgURL ] = useState('')
  const [ box, setBox ] = useState({})
  const [ route, setRoute ] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)

const onRouteChange = (newRoute) => {
  if (newRoute === 'signout') {
    setIsSignedIn(false)
  } else if(newRoute === 'home') {
    setIsSignedIn(true)
  }
  setRoute(newRoute)

}
  const onInputChange = (event) => {
    setInput(event.target.value)
  }
  
  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (obj) => {
    setBox(obj)
  }

  const onButtonSubmit = () => {
    setImgURL(input)
    fetch(PROXY_URL + CLARIFAI_URL, returnClarifaiReqOpt(input))
      .then(response => response.json())
      .then(result => displayFaceBox(calculateFaceLocation(result)))
      .catch(error => console.log('error', error));
  }


  return (
    <div className='App'>
      <ParticlesBg type="circle" bg={true}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      { route === 'home'
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
            {imgURL !== '' ? <FaceRecognition box={box} imgURL={imgURL}/>: ''}
          </div>
        : (
          route === 'signin'
          ? <Signin onRouteChange={onRouteChange} /> 
          : <Register onRouteChange={onRouteChange}/>
        )  
      }
    </div>
  );
}

export default App;
