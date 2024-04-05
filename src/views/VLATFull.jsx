import {useContext, useEffect, useRef, useState} from "react";
import {FlowContext} from "../App.jsx";
import {VLATQuestions} from "../assets/vlatQ.js"
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
import {ACQuestions} from "../assets/AttentionQ.js";

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


export default function VLATFull({step, nxtUrl, attentionChecks}) {
    const addAttentionChecks = () => {
        let fullVlatQuestions = [...VLATQuestions];
        for(let i = 0;i<attentionChecks[0].length;i++){
            let idx = attentionChecks[0][i]
            let checkIdx = attentionChecks[1][i] - 100
            fullVlatQuestions.splice(idx-1, 0, ACQuestions[checkIdx])
            console.log([...fullVlatQuestions],i)
        }
        return fullVlatQuestions;
    }
    const fullVLATQuestions = addAttentionChecks();
    const expLen = fullVLATQuestions.length;

    const navigate = useNavigate();

    const userID = ls.get('ID',  { decrypt: true });
    const expName = ls.get("expname",{decrypt: true}) || defaultExpName

    const {activeStep, setActiveStep} = useContext(FlowContext);
    const [qidx, setQidx] = useState(1);
    const [idx, setIdx] = useState(1);
    const [activeQuestion,setActiveQuestion]= useState(fullVLATQuestions[0])
    const [answer, setAnswer] = useState('')
    const [record, setRecord] = useState({})
    const [loading, setLoading] = useState(false)
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';




    const setUserAnswer = (e) => {
        setAnswer(e.target.value)

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
            // setQidx(nextQID);
            const nextQuestion = fullVLATQuestions[idx]
            setQidx(nextQuestion.originID)
            setActiveQuestion(nextQuestion)
            setIdx(idx + 1);
            if (activeQuestion.img === curImg)
                setLoading(false)
        })
            .catch((e)=>{
                console.log(e)
                setLoading(false)
            })




    }


    useEffect(() => {
        setActiveStep(step)

        const getRecords = async ()=>{
            const docRef = doc(fb, expName, userID);
            const docSnap = await getDoc(docRef);
            // console.log(docSnap.data(),"snap data")
            if(docSnap.data()) {
                let curIdx = Object.keys(docSnap.data()).length+1;
                if(curIdx >= expLen) navigate(nxtUrl);
                else{
                    setRecord(docSnap.data())
                    const question = fullVLATQuestions[curIdx]
                    setQidx(question.originID);
                    setActiveQuestion(question)
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
