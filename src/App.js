import React from 'react';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'; 
// import { PhotoPicker } from 'aws-amplify-react';

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

// let uploadToStorage = async image => {
//   try {
//     console.log(image)
//     console.log(image.files[0])
//     // console.log(pathToImageFile)
//     // const response = await fetch(pathToImageFile.name)
//     // console.log(response)
//     // const blob = await image.blob()
//     // console.log(blob)
//     Storage.put(image.name, image, {
//       contentType: 'image/jpeg',
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

let onChange = (e) => {
  console.log(e)
  const file = e.target.files[0];
  console.log(file)
  Storage.put(file.name, file, {
      contentType: 'image/png'
  })
  .then (result => console.log(result))
  .catch(err => console.log(err));
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <PhotoPicker onPick={data => uploadToStorage(data)} /> */}
        <input
              type="file" accept='image/jpg'
              onChange={(e) => onChange(e)}
          />
      </header>
    </div>
  );
}
export default withAuthenticator(App, true);
// export default App;
