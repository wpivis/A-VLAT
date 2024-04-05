import './App.css'
import {HeaderResponsive} from "./components/HeaderResponsive.jsx";
import {
    AppShell,
    ColorSchemeProvider,
    DEFAULT_THEME,
    Header,
    LoadingOverlay,
    MantineProvider,
    Navbar
} from '@mantine/core';
import {Route, Routes, useSearchParams} from "react-router-dom";
import StepperVertical from "./components/StepperVertical.jsx";
import React, {useEffect, useState} from "react";
import VLAT from "./views/VLAT";
import Debrief from "./views/Debrief";
import Thankyou from "./views/Thankyou.jsx";
import ConsentProlific from "./views/ConsentProlific.jsx";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {fb} from "./firebase/firebase-config.js";
import ExpSetting from "./views/ExpSetting.jsx";
import ls from 'localstorage-slim';

const mockHeaderdata = {
    "links": [
        {
            "link": "/about",
            "label": "Adaptive VLAT"
        },

    ]
}


const customLoader = (
    <>
        <svg
            width="300"
            height="300"
            viewBox="-30 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            stroke={DEFAULT_THEME.colors.blue[6]}
        >
            <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="2">
                    <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <text x={3} y={55} fontSize={15} fontWeight={"lighter"} stroke={"black"}  strokeWidth="1">Wait</text>
                    <text x={-20} y={70} fontSize={8}  fontWeight={"lighter"} stroke={"black"}  strokeWidth="1">Survey will start soon</text>

                </g>
            </g>
        </svg>
    </>

);


export const FlowContext = React.createContext(null);

function App() {
    const [activeStep, setActiveStep] = useState(0);
    const [totalStep, setTotalStep] = useState(4);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expMode, setExpMode] = useState(ls.get('expmode',  { decrypt: true }) || "adaptive-class");
    const [expOn, setExpOn] = useState(true);
    const [expDB, setExpDB] = useState(searchParams.get("db") || ls.get('expname',  { decrypt: true }))



    //for theme
    const [colorScheme, setColorScheme] = useState('light');
    const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));


    // useEffect(()=>{
    //     const unsub = onSnapshot(doc(fb, "settings", expDB), (doc) => {
    //         console.log(doc.data())
    //         setExpOn(doc.data().on)
    //     });
    //
    //     return unsub;
    // },[])

    return (
        <FlowContext.Provider value={{activeStep, setActiveStep,totalStep, setTotalStep, setExpMode, expMode, setExpDB}}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>

                <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                    <LoadingOverlay visible={!expOn} overlayBlur={4} loader={customLoader}/>
                    <AppShell

                      padding="md"
                      navbar={<StepperVertical />}
                      header={<HeaderResponsive links={mockHeaderdata.links}/>}
                      styles={(theme) => ({
                          main: {
                              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                              minHeight: "90vh",
                              paddingTop: 30
                          },
                      })}
                  >
                        {/*To add attention check questions, use the following to the route element. and change expLen parameter accordingly*/}
                        {/*<Route path="vlat" element={<VLAT step={1} expLen={29} nxtUrl={"/reliability-adaptive-vlat-2nd/thankyou"} attentionChecks={[[8, 17], [101, 100]]}/>}/>*/}

                        <Routes>
                              <Route path="" element={<ExpSetting step={0}/>} />
                              <Route path={"demo"}>
                                  <Route path="consent" element={<ConsentProlific step={0} nxtUrl={"/demo/vlat"} fileName={"demo-consent.md"}/>} />
                                  <Route path="vlat" element={<VLAT step={1} expLen={27} nxtUrl={"/demo/debrief"}/>} />
                                  <Route path="debrief" element={<Debrief step={2} nxtUrl={"/demo/thankyou"}/>} />
                                  <Route path="thankyou" element={<Thankyou step={3}/>} />
                              </Route>
                          </Routes>
                  </AppShell>

                </MantineProvider>
            </ColorSchemeProvider>

        </FlowContext.Provider>

  )
}

export default App
