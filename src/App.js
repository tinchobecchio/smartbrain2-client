import {  useState } from 'react';
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
// import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


function App() {
  const [ input, setInput ] = useState('')
  const [ imgURL, setImgURL ] = useState('')
  const [ box, setBox ] = useState({})
  const [ route, setRoute ] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })

  const loadUser = (data) => {
    setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    })
  }

const onRouteChange = (newRoute) => {
  if (newRoute === 'signout') {
    setInput('')
    setImgURL('')
    setBox({})
    setRoute('signin')
    setIsSignedIn(false)
    setUser({
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    })
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
    fetch('https://smartbrain2-api.onrender.com/imageurl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        url: input
      })
    })
      .then(response => response.json())
      .then(result => {
        
        if(result) {
          fetch('https://smartbrain2-api.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(resp => resp.json())
            .then(count => {
              setUser({
                ...user,
                entries: count
              })
            })
            .catch(console.log)
        }
        
        displayFaceBox(calculateFaceLocation(result))

      })
      .catch(error => console.log('error', error));
  }

 
  return (
    <div className='App'>
      {/* <ParticlesBg type="circle" bg={true}/> */}
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
            {imgURL !== '' ? <FaceRecognition box={box} imgURL={imgURL}/>: ''}
          </div>
        : (
          route === 'signin'
          ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} /> 
          : <Register loadUser={loadUser} onRouteChange={onRouteChange}/>
        )  
      }
    </div>
  );
}

export default App;
