# A-VLAT

![Adaptive flow](https://i.ibb.co/Lg0NYkM/Adaptive-flow.png)

Paper: https://ieeexplore.ieee.org/abstract/document/10295997?casa_token=UinzvF_hMtwAAAAA:gYckztZwzaOsc0dZsVeb-3Lcwiv6msGLB8XxeZTqWnUhD08foSo3GzRHyjcMwHd-sHaCNG4

Citation: Y. Cui, L. W. Ge, Y. Ding, F. Yang, L. Harrison and M. Kay, "Adaptive Assessment of Visualization Literacy," in IEEE Transactions on Visualization and Computer Graphics, vol. 30, no. 1, pp. 628-637, Jan. 2024, doi: 10.1109/TVCG.2023.3327165

## Requirements
* Cloud Firestore from Firebase
* Github account
* Adaptive backend API


## Setup-database
1. Create a new Cloud Firestore database in Firebase, allow read and write access to all users, and enable anonymous login. 
2. Add a new web app and copy the configuration. Replace the configuration in the file src/firebase.js.
3. Create a collection name "settings".
4. Create a document with ID: debug (it is the default database name).
5. Add two fields to the document:
   * `mode` with the value `demo`
   * `on` with the value `true`

## Update backend API
Update backend API in ```nextQuestionURL src/constants/endpoints.js```

## Running the App Locally
1. Run `npm install`.
2. Run `npm run dev` to start the app.
3. open http://localhost:5173/AdaptiveVLATSup/demo/consent in your browser(Port may change).

## Deployment
If you want to deploy this assessment to a public domain, follow these steps:
1. Change homepage URL to your forked Github repository, and change the name to repository name in `package.json`
2. Change the base URL in `vite.config.js` to your forked repository name.
3. Change the basename in `App.jsx` to your forked repository name.
3. run `npm run deploy` to deploy the app to Github Pages.
4. Turn on Github pages in your repository settings and select the `gh-pages` branch. 



## Reshape the assessment

### To Create different assessment flow
You can change the sequence of view that present to participants at `app.jsx`
And you can and plug in any component you created

### To insert static questions
Follow the comments in `app.jsx` to insert attention check questions.

### To launch mulitple assessments simoultaneously
1. Follow the pattern of "demo" in `app.jsx`, you can create as many as assessments you want,
and they can be launched and collecting data independently.
2. After create the Routes, you need to add one entry in settings collection in the database.The mode in database
should match the path name.
3. Add your new mode to `src/components/StepperVertical.jsx` if it has a different experiment flow.
4. To use the original version of VLAT, swith to `src/views/VLATFull` component. 
5. ```src/views/ExpSetting.jsx``` was used to read settings from firebase, then redirect to different versions of experiment. This feature won't work without adding settings in firebase. 


