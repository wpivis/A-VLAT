import {useContext, useEffect, useRef, useState} from "react";
import {Stepper, useMantineColorScheme} from "@mantine/core";
import {FlowContext} from "../App.jsx";

function Stepper4({activeStep, dark}){

    return (
        <Stepper active={activeStep}
                 orientation="vertical"
                 sx={{padding:10, paddingTop:30}}
                 color={dark ? 'yellow' : 'blue'}
        >
            <Stepper.Step label="Consent Form" description="Consent form"  loading={activeStep===0}/>
            <Stepper.Step label="VLAT" description="Questions" loading={activeStep===1}/>
            <Stepper.Step label="Debrief" description="Demographic survey"  loading={activeStep===2}/>
            <Stepper.Step label="Completion" description=""  loading={activeStep===3}/>

        </Stepper>
    );
}

function Stepper3({activeStep, dark}){

    return (
        <Stepper active={activeStep}
                 orientation="vertical"
                 sx={{padding:10, paddingTop:30}}
                 color={dark ? 'yellow' : 'blue'}
        >
            <Stepper.Step label="Consent Form" description="Consent form"  loading={activeStep===0}/>
            <Stepper.Step label="VLAT" description="Questions" loading={activeStep===1}/>
            <Stepper.Step label="Completion" description=""  loading={activeStep===2}/>

        </Stepper>
    );
}


export default function StepperVertical({}) {
    const {activeStep, setActiveStep, expMode} = useContext(FlowContext);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <>
            {(() => {
                switch (expMode) {
                    case 'demo':
                        return <Stepper4 activeStep={activeStep} dark={dark}/>
                    default:
                        return  <Stepper3 activeStep={activeStep} dark={dark}/>
                }
            })()}

        </>
    )


}
