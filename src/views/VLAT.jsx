import {useContext, useEffect, useRef, useState} from "react";
import {FlowContext} from "../App.jsx";
import {VLATQuestions} from "../assets/vlatQ.js"
import {ACQuestions} from "../assets/AttentionQ.js";
import {Grid, Image, LoadingOverlay, Radio, useMantineColorScheme} from "@mantine/core";
import vlat1  from "../assets/vlatImg/VLAT1.png"
import vlat2  from "../assets/vlatImg/VLAT2.png"
import vlat3  from "../assets/vlatImg/VLAT3.png"
import vlat4  from "../assets/vlatImg/VLAT4.png"
import vlat5  from "../assets/vlatImg/VLAT5.png"
import vlat6  from "../assets/vlatImg/VLAT6.png"
import vlat7  from "../assets/vlatImg/VLAT7.png"
import vlat8  from "../assets/vlatImg/VLAT8.png"
import vlat9  from "../assets/vlatImg/VLAT9.png"
import vlat10  from "../assets/vlatImg/VLAT10.png"
import vlat11  from "../assets/vlatImg/VLAT11.png"
import vlat12  from "../assets/vlatImg/VLAT12.png"
import { Button } from '@mantine/core';
import {nextQuestionURL, nextQuestionURLTest} from "../constants/endpoints.js";
import {doc, getDoc} from "firebase/firestore";
import {addRecord, fb, defaultExpName} from "../firebase/firebase-config.js";
import ls from "localstorage-slim";
import { useNavigate } from "react-router-dom";



const imgMap = {
    VLAT1:vlat1,
    VLAT2:vlat2,
    VLAT3:vlat3,
    VLAT4:vlat4,
    VLAT5:vlat5,
    VLAT6:vlat6,
    VLAT7:vlat7,
    VLAT8:vlat8,
    VLAT9:vlat9,
    VLAT10:vlat10,
    VLAT11:vlat11,
    VLAT12:vlat12,

}

const FullQuestions = [...VLATQuestions,...ACQuestions]

export default function VLAT({expLen=27, step,nxtUrl,attentionChecks=[[],[]]}) {
    const getVLATQuestion = (itemID) => {
        const q = FullQuestions.filter(vlatq => vlatq.originID === itemID);
        return q[0];
    }
    const navigate = useNavigate();

    const userID = ls.get('ID',  { decrypt: true });
    const expName = ls.get("expname",{decrypt: true}) || defaultExpName

    const {activeStep, setActiveStep} = useContext(FlowContext);
    const [qidx, setQidx] = useState(10);
    const [idx, setIdx] = useState(1);
    const [activeQuestion,setActiveQuestion]= useState(getVLATQuestion(10))
    const [answer, setAnswer] = useState('')
    const [record, setRecord] = useState({})
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    console.log(VLATQuestions.length, "length")



    const setUserAnswer = (e) => {
        setAnswer(e.target.value)

    }

    const buildFormData = (curRecord)=>{
        let formData = new FormData();
        const qidArr = [];
        const correctArr = [];
        for(const [id,entry] of Object.entries(curRecord)){
            if(entry.qid<99){
                qidArr.push(entry.qid);
                correctArr.push(entry.correct);
            }
        }

        formData.append('uid', userID);
        formData.append('qid', JSON.stringify(qidArr));
        formData.append('correct', JSON.stringify(correctArr));

        return formData;

    }

     const getNextQuestion = async (formdata = {}) => {

        // Default options are marked with *
        const response = await fetch(nextQuestionURL, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            mode: 'cors',
            cache: 'no-cache',
            body: formdata
        });
        return await response.json();
    }

    const getdataEntry = () => {
        return {
            "qid":qidx,
            "answer":answer,
            "answerIdx": activeQuestion.options.indexOf(answer),
            "trueAnswer": activeQuestion.options[activeQuestion.trueAnswer],
            "trueAnswerIdx":activeQuestion.trueAnswer,
            "correct": answer === activeQuestion.options[activeQuestion.trueAnswer]? 1 : 0

        }
    }

    const nextIndex = async () => {

        if(isCheck){
            attentionChecks[0].shift();
            attentionChecks[1].shift();
        }

       if(attentionChecks[0].includes(idx+1)){
           console.log("attention Check")
           const acID = attentionChecks[1][0]
           setLoading(true)
           const newrecord = {...record}
           const newentry = getdataEntry();
           newrecord[idx]= newentry
           setRecord(newrecord)
           const firebaseNewRecord = {}
           firebaseNewRecord[idx] = newentry
           await addRecord(userID, idx, firebaseNewRecord, expName).then(async () => {
               if (idx >= expLen) {
                   navigate(nxtUrl)
               }
               setAnswer('')

               const curImg = activeQuestion.img;
               const nextQID = acID;
               setQidx(nextQID);
               setActiveQuestion(getVLATQuestion(nextQID))
               setIdx(idx + 1);
               setIsCheck(true);
               if (activeQuestion.img === curImg)
                   setLoading(false)
           })
               .catch(()=>{
                   setLoading(false)
               })


       } else{
           setLoading(true)
           setIsCheck(false);

           const newrecord = {...record}
           const newentry = getdataEntry();
           newrecord[idx]= newentry
           setRecord(newrecord)
           const firebaseNewRecord = {}
           firebaseNewRecord[idx] = newentry
           await addRecord(userID, idx, firebaseNewRecord, expName).then(async () => {
               if (idx >= expLen) {
                   navigate(nxtUrl)
               }
               setAnswer('')

               const curImg = activeQuestion.img;
               const nextData = await getNextQuestion(buildFormData(newrecord))
               const nextQID = nextData["item_id"];
               setQidx(nextQID);
               setActiveQuestion(getVLATQuestion(nextQID))
               setIdx(idx + 1);
               if (activeQuestion.img === curImg)
                   setLoading(false)
           })
               .catch(()=>{
                   setLoading(false)
               })
       }

    }


    useEffect(() => {
        setActiveStep(step)

        const getRecords = async ()=>{
            const docRef = doc(fb, expName, userID);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data(),"snap data")
            if(docSnap.data()) {
                let curIdx = Object.keys(docSnap.data()).length+1;
                if(curIdx >= expLen) navigate(nxtUrl)
                else if(attentionChecks[0].includes(curIdx)){
                    setRecord(docSnap.data())
                    while (attentionChecks[0][0] < curIdx){
                        attentionChecks[0].shift();
                        attentionChecks[1].shift();
                    }
                    const nextQID = attentionChecks[1][0]
                    setQidx(nextQID);
                    setActiveQuestion(getVLATQuestion(nextQID))
                    setIdx(curIdx);
                    setIsCheck(true);

                }
                else{
                    setRecord(docSnap.data())
                    const nextData = await getNextQuestion(buildFormData(docSnap.data()))
                    const nextQID = nextData["item_id"];
                    setQidx(nextQID);
                    setActiveQuestion(getVLATQuestion(nextQID))
                    setIdx(curIdx);

                }

            }
        }
        getRecords();



    }, []);

    return (
        <>
            <LoadingOverlay visible={loading} overlayBlur={2} />

            <Grid>
                <Grid.Col md={8} sm={12}>
                    <Image
                        radius="sm"
                        src={imgMap[activeQuestion["img"]]}
                        alt="VIS"
                        style={{width:"100%"}}
                        onLoad={() => setLoading(false)}

                    />
                </Grid.Col>
                <Grid.Col md={4} sm={12}>
                    <div style={{textAlign:"left",  paddingLeft: '20px',display:"inline-block" }}>
                        <Radio.Group
                            name="question"
                            orientation="vertical"
                            label={ idx + ". "+activeQuestion["question"]}
                            value={answer}
                            size={"md"}

                        >
                            {
                                activeQuestion["options"].map((op,idx)=>{
                                    return  <Radio
                                        color={dark ? 'yellow' : 'blue'}
                                        value={op}
                                        label={op}
                                        key={"op"+idx}
                                        onClick={setUserAnswer}/>
                                })
                            }


                        </Radio.Group>
                    </div>

                </Grid.Col>
            </Grid>
            <Button variant="gradient"
                    disabled={answer === ''}
                    onClick={nextIndex}
                    style={{marginTop: '30px'}}
                    gradient={dark ?{ from: 'yellow', to: 'orange' } :{ from: 'indigo', to: 'cyan' }}>
                NEXT
            </Button>




        </>
    );
}
