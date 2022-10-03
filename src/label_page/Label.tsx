import React, { useState, useLayoutEffect, useEffect } from "react";
import {Button, FormGroup, Alert, Slider, ProgressBar, Position} from "@blueprintjs/core";
import {Tooltip2, Popover2} from "@blueprintjs/popover2";
import {Page, Tab} from "../common";
import emailData from "../label_page/emailData";
import Carousel from 'react-elastic-carousel';

function getMax() {
  const elementsOfInterest: any[] = [
    "day_since_hire",
    "size",
    "files_sensitive_count",
    "file_count",
    "rcpt_count"
  ];

  const visualDic : any = {};

  for (const element of elementsOfInterest) {
    visualDic[element] = -1;
  }

  for (let i = 0; i < emailData.length; i++) {
    for (const element of elementsOfInterest) {
      const number = emailData[i][element];
      if (Number.isNaN(parseInt(number))) {
        console.error("Value in find max is not a number");
        continue;
      }
      visualDic[element] = Math.max(visualDic[element], parseInt(number));
    }
  }
  console.log(visualDic);
  return visualDic;
}

function EmailBox({ index, email, sensitivityMap, setSensitivityMap}: 
  {index: number, email: any, sensitivityMap: Record<string, Record<string, any>>, setSensitivityMap: (val: any) => void}) {
  const [confidence, setConfidence] = useState(1);
  const [pop, setPop] = useState(false);
  // const [clickedSave, setClickedSave] = useState(false);
  const [popoverContent, setPopoverContent] = useState(Tab.SenderInfo);
  const visualItemMax = getMax();

  function handelScatterPlot() {
    setPopoverContent(Tab.ScatterPlot);
  }

  function handelEmailHistory() {
    setPopoverContent(Tab.EmailHistory);
  }

  function handelSenderInfo() {
    setPopoverContent(Tab.SenderInfo);
  }

  function handleBarColor(value:any) {
    if (value < 0.3) {
      return "success";
    } else if (value > 0.3 && value < 0.7) {
      return "primary";
    } else {
      return "danger";
    }
  }
  
  useEffect(() => console.log("Sensitivity map: ", sensitivityMap), [sensitivityMap]);
  return (
    <div className="email-element">
      <div className="email-box-header">
        <p className="email-header">{"Email " + (index + 1)}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

        <FormGroup className="email-box-labels" inline={true} style={{ position: "relative", top: -10, left:700 }}>
          <Popover2
            interactionKind="click"
            isOpen={pop}
            fill={false}
            placement="bottom-end"
            content={
              <div className="popover">
                <div className="popover-button">
                  <div>
                    <button 
                      className="popover-content-button"
                      onClick={handelSenderInfo}
                    > Sender Info
                    </button>
                    <hr className="popover-separator"/>
                  </div>

                  <div>
                    <button 
                      className="popover-content-button"
                      onClick={handelScatterPlot}
                    > Scatter Plot
                    </button>
                    <hr className="popover-separator"/>
                  </div>
            
                  <div>
                    <button 
                      className="popover-content-button"
                      onClick={handelEmailHistory}
                    > Email History
                    </button>
                  </div>

                </div>
                <div className="popover-content-detail">
                  {popoverContent == Tab.SenderInfo && <div>
                    <p>Division: {JSON.stringify(email.division, null, 2).slice(1,-1)}</p> 
                    <p>EmailId: {JSON.stringify(email.mid, null, 2).slice(1,-1)}</p> 
                  </div>}

                  {popoverContent == Tab.ScatterPlot && <div>
                    <p>Below display {email.sender} scatter plot: </p>
                  </div>
                  }

                  {popoverContent == Tab.EmailHistory && <div>
                    <p>Below display {email.sender} email history: </p>
                  </div>
                  }
                </div>
 
              </div>
            }
          >
            <button 
              className="sender-button"
              id={"sender-button" + (index + 1)}
              onClick={()=> {
                  console.log("sender" + (index+1));
                  setPop(!pop);
                }
              }
            > 
              More Info regarding Sender {email.sender}
            </button>
          </Popover2>
        
        </FormGroup>
      </div>
      <hr className="separator" />
      <p> </p>
      <div className="email-content">
        <p> <b>DateSent:</b> {JSON.stringify(email.year, null, 2).slice(1,-1)}/{JSON.stringify(email.month, null, 2).slice(1,-1)}/{JSON.stringify(email.day, null, 2).slice(1,-1)}</p> 
        <p> </p>
        <p> <b>Sender:</b> {JSON.stringify(email.sender, null, 2).slice(1,-1)}</p> 
        <p> </p>
        <p> <b>Recipient:</b> {JSON.stringify(email.rcpt, null, 2).slice(1,-1)}</p> 
        <p> </p>
        <p> <b>Email Subject:</b> {JSON.stringify(email.files, null, 2).slice(1,-1)}</p> 
        <p> </p>
        <div className="email-bar-individual">
            <p> <b>Recipient Count: </b> </p> 
            <Tooltip2 
              position={Position.TOP}
              hoverCloseDelay={400}
              hoverOpenDelay={400}
              
              content={<p>{JSON.stringify(email.rcpt_count, null, 2).slice(1,-1)}, max:{visualItemMax.rcpt_count} </p>}
            >
              <ProgressBar className="email-bar"
                animate={false}
                stripes={false}
                value={email.rcpt_count/visualItemMax.rcpt_count} 
                intent={handleBarColor(email.rcpt_count/visualItemMax.rcpt_count)}
              />
            </Tooltip2>
             
        </div>
        <p> </p>
        <div className="email-bar-individual">
          <p> <b>Files Sensitive Count: </b> 
            {/* {JSON.stringify(email.size, null, 2).slice(1,-1)} */}
          </p> 
          <Tooltip2 
              position={Position.TOP}
              hoverCloseDelay={400}
              hoverOpenDelay={400}
              
              content={<p>{JSON.stringify(email.files_sensitive_count, null, 2).slice(1,-1)}, max:{visualItemMax.file_count} </p>}
          >
            <ProgressBar className="email-bar"
              animate={false}
              stripes={false}
              value={email.files_sensitive_count/visualItemMax.file_count} 
              intent={handleBarColor(email.files_sensitive_count/visualItemMax.file_count)}
            />
          </Tooltip2>
        </div>
        <p> </p>
        <div className="email-bar-individual">
          <p> <b>Files Size: </b> 
            {/* {JSON.stringify(email.size, null, 2).slice(1,-1)} */}
          </p> 
          <Tooltip2 
              position={Position.TOP}
              hoverCloseDelay={400}
              hoverOpenDelay={400}
              
              content={<p>{JSON.stringify(email.size, null, 2).slice(1,-1)}, max:{visualItemMax.size} </p>}
          >
            <ProgressBar className="email-bar"
              animate={false}
              stripes={false}
              value={email.size/visualItemMax.size} 
              intent={handleBarColor(email.size/visualItemMax.size)}
            />
          </Tooltip2>
        </div>
        <p> </p>
        <div className="email-bar-individual">
          <p> <b>Day since hire:</b> 
            {/* {JSON.stringify(email.day_since_hire, null, 2).slice(1,-1)} */}
          </p> 
          <Tooltip2 
              position={Position.TOP}
              hoverCloseDelay={400}
              hoverOpenDelay={400}
              
              content={<p>{JSON.stringify(email.day_since_hire, null, 2).slice(1,-1)}, max:{visualItemMax.day_since_hire} </p>}
          >
            <ProgressBar className="email-bar"
              animate={false}
              stripes={false}
              value={email.day_since_hire/visualItemMax.day_since_hire} 
              intent={handleBarColor(email.day_since_hire/visualItemMax.day_since_hire)}
            />
          </Tooltip2>
        </div>
      </div>
      <FormGroup className="email-box-labels" inline={true} style={{ position: "relative", top: -0.5 }}>
          <button 
            className={"label-button"} 
            id={"label-button-" + (index + 1)}
            onClick={() => {
              const newMap = { ...sensitivityMap };
              newMap[index + 1]["sensitive"] = true;
              setSensitivityMap(newMap);
              document.getElementById("label-button-" + (index + 1))!.style.backgroundColor="rgb(182, 59, 59)";
              document.getElementById("label-button-" + (index + 1))!.style.color="rgb(255,255,255)";
              document.getElementById("label-button-non-" + (index + 1))!.style.backgroundColor="rgb(255, 255, 255)";
              document.getElementById("label-button-non-" + (index + 1))!.style.color="rgb(0, 0, 0)";
            }}
          >
            Sensitive
          </button>

          <button 
            className={"label-button-non"}
            id={"label-button-non-" + (index + 1)} 
            onClick={() => {
              const newMap = { ...sensitivityMap };
              newMap[index + 1]["sensitive"] = false;
              setSensitivityMap(newMap);
              document.getElementById("label-button-non-" + (index + 1))!.style.backgroundColor="rgb(45, 125, 45)";
              document.getElementById("label-button-non-" + (index + 1))!.style.color="rgb(255,255,255)";
              document.getElementById("label-button-" + (index + 1))!.style.backgroundColor="rgb(255, 255, 255)";
              document.getElementById("label-button-" + (index + 1))!.style.color="rgb(0, 0, 0)";
            }}
          >
            Non-Sensitive
          </button>

          <h1 className="slider-notes">Confidence Slider: 1 being extremely inconfident, 10 being extremely confident</h1>
          <Slider
            className="confidence-slider"
            min={1}
            max={10}
            stepSize={0.1}
            labelPrecision={0.1}
            onChange={
              (val) => {
                setConfidence(val);
                const newMap = { ...sensitivityMap };
                newMap[index + 1]["confidence"] = val;
                setSensitivityMap(newMap);
                // console.log("NEW map after conf change: ", newMap);
              }
            }
            value={confidence}
            intent="none"
          />

        </FormGroup>
        {/* <button 
            className={"save-button"} 
            id={"save-button" + (index + 1)}
            onClick={() => {
              console.log({index}+"clicked")
            }}
          >
            Save
        </button> */}
    </div>
  );
}

function Label({ numEmails, page, setPage }:
  {numEmails: number,page: number,setPage: (page: number) => void,}) {

  const [alertExitPage, setAlertExitPage] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [emails, setEmails] = useState<any>([]);
  
  function handleSubmit() {
    console.log("Sensitivity map: ", sensitivityMap);
    setSubmit(!submit);
  }

  useEffect(() => {
    // fetch("https://random-data-api.com/api/stripe/random_stripe?size=" + numEmails)
    //   .then(response => response.json())
    //   .then(jsonData => {
    //     // console.log("JSON DATA: ", jsonData);
    //     setEmails(jsonData)
    //   });
    const emailsToShow = [];
    for (let i = 0; i < numEmails; i++) {
      emailsToShow.push(emailData[i]);
    }
    setEmails(emailsToShow);
  }, [numEmails]);

  const initialMap: Record<string, Record<string, any>> = {};
  for (let i = 0; i < numEmails; i++) {
    initialMap[i + 1] = {
      sensitive: false, 
      confidence: 0,
      marked: false
    };
  }

  const [sensitivityMap, setSensitivityMap] = useState(initialMap);

  const mappingFunc = (email: any, index: number, map: any, setMap: any) => {
    return (
      <EmailBox index={index} email={email} sensitivityMap={map} setSensitivityMap={setMap}/>
    );
  };

  const handleExitCancel = () => {
    setAlertExitPage(!alertExitPage);
  };

  const handleExitConfirm = () => {
    setPage(Page.Survey);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(emails.map((email: any, index: number) => mappingFunc(email, index, sensitivityMap, setSensitivityMap)))
  return (
    <div className="email-grid-big-block">
      <Button
        icon="arrow-left"
        intent="warning"
        text={"Back to Selection Page"}
        onClick={() => {
          setAlertExitPage(!alertExitPage);
        }}
      />

      <Alert
        className="alert-box"
        isOpen={alertExitPage}
        confirmButtonText="Exit"
        cancelButtonText="Cancel"
        icon="undo"
        intent="danger"
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      >
        <h2 className="alert-header">Are you sure you want to exit?</h2>
        <p className="alert-sub">Your data will be lost.</p>
      </Alert>

      <pre>
        <div className="email-grid">
          {// @ts-ignore
          <Carousel>
            {emails.map((email: any, index: number) => mappingFunc(email, index, sensitivityMap, setSensitivityMap))}
          </Carousel>}
        </div>
      </pre>
      
      <button 
          className="submit-button-2"
          onClick={() => {
            console.log("Setting submit true");
            setSubmit(true);
          }}>
          SUBMIT
      </button>

      <Alert
        className="submit-box"
        isOpen={submit}
        icon="clean"
        intent="success"
        confirmButtonText="Submit"
        cancelButtonText="Cancel"
        onConfirm={handleSubmit}
        onCancel={()=>{
          setSubmit(false);
        }}
      >
        <h2 className="submit-header">Are you sure you want to submit?</h2>
        <p className="submit-sub">You can't undo this submit.</p>
        {/* <h2 className="submit-header">You have successfully submit the labelling.</h2>
        <p className="submit-sub">Thank you for your participation.</p> */}
      </Alert>
    </div>
  );
}

export default Label;