import React from 'react';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'; 
import { PhotoPicker } from 'aws-amplify-react';

// Amplify.configure(
//   {
//     Storage: {
//       AWSS3: {
//         bucket: 'snif-images-repo'
//       }
//     }
//   }
// )
// console.log(awsconfig)
Amplify.configure(awsconfig);

let uploadToStorage = async pathToImageFile => {
  try {
    const response = await fetch('/Users/PS/Desktop/dog0.jpg')
    
    const blob = await response.blob()
    
    Storage.put('dog0.jpg', blob, {
      contentType: 'image/jpeg',
    })
  } catch (err) {
    console.log(err)
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PhotoPicker onPick={data => uploadToStorage(data)} />
      </header>
    </div>
  );
}
export default withAuthenticator(App, true);
// export default App;
