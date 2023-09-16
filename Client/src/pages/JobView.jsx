import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import "../assets/css/JobView.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Wrapper from '../assets/wrappers/JobView';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from "react-share";
function JobView() {
  let { id, user } = useParams();
  const location = useLocation();
  console.log(id)
  const [job, setJob] = useState({})
  const [shear, setShear] = useState(false)

const getData = ()=>{
  axios.get(`/get/job/?id=${id}`).then(async (response) => {
    let res = await response.data;
    console.log(res)
    if (res.done) {

      setJob(res.data)
      setMainPic(res.data.visa)
    }

  })
}
  // for shearing the link of the page
  const currentURL = window.location.href;
  useEffect(() => {
  getData()
  }, [])
  const Ref = useRef();
  const downloadPdf = () => {
    const input = Ref.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save();
    })
  }
  const ShearBtns = () => {
    setShear(!shear)
  }
  const Print = ()=>{
    window.print()
  }
  const [mainPic, setMainPic] = useState("")
  return (
    <>
      <div className="container">
        {
          job ? <>
            <div className="container" ref={Ref}>

              <h1 className='title-color'>User Information</h1>

              <div className="picture-div" style={{ margin: "20px auto" }}>
                <div className="view-pic">
                  <img src={`/uploads/${mainPic}`} alt={` the ${mainPic} picture of the user`} />
                </div>
                <div className="layout2">
                  <div className="img-div"> <img src={`/uploads/${job.visa}`} alt={` the ${job.visa} picture of the user`} onClick={() => setMainPic(job.visa)} /></div>
                  <div className="img-div">
                    <img src={`/uploads/${job.protector}`} alt={` the ${job.protector} picture of the user`} onClick={() => setMainPic(job.protector)} />
                  </div>
                  <div className="img-div">
                    <img src={`/uploads/${job.ticket}`} alt={` the ${job.ticket} picture of the user`} onClick={() => setMainPic(job.ticket)} />
                  </div>
                  <div className="img-div">
                    <img src={`/uploads/${job.passport}`} alt={` the ${job.passport} picture of the user`} onClick={() => setMainPic(job.passport)} />
                  </div>
                </div>
              </div>

                {/* picture section */}

            <InfoView data={job}/>

               
              </div>

              <br />


            <div className="btn-group">
              <button onClick={downloadPdf} className='btn'>Download Pdf</button>
              <button onClick={Print} className='btn'>Print</button>
              
              {location.state ? <>
                <button onClick={ShearBtns} className='btn'>
                  {shear ? <>Cancel</> : <>Shear</>}
                </button></> : ""}

            </div>

            {/* for Shear Buttons */}
            {location.state ? <>
              {
                shear ?
                  <>
                    <div style={{ display: "flex", justifyContent: "start", gap: "10px", flexWrap: "wrap" }}>
                      <FacebookShareButton url={currentURL} quote='Job Information' hashtag='#Job_Alert' size={24}>
                        <FacebookIcon iconFillColor='white' round={true} />
                      </FacebookShareButton>

                      <WhatsappShareButton url={currentURL} title='Job information' size={24}>
                        <WhatsappIcon iconFillColor='white' round={true} />
                      </WhatsappShareButton>

                      <EmailShareButton url={currentURL} size={24}>
                        <EmailIcon iconFillColor='white' round={true} />
                      </EmailShareButton>
                    </div>
                  </> : ""
              }
            </>
              :
              ""
            }
          </> : <>
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <h1 style={{ color: "red" }}>
                Sorry! You Url is Inncorrect
              </h1>
            </div>
          </>
        }
      </div>
    </>
  )
}

function InfoView(props) {
  let data = props.data
  return (
    <Wrapper>

      <div className='job-center'>
        {/* images get */}

        {/* name */}
        <div className="job-row">
          <div className='job-title'>Name</div>
          <div className="job-name">{data.name}</div>
        </div>
        {/* f_name */}
        <div className="job-row">
          <div className='job-title'> Father Name</div>
          <div className="job-name">{data.f_Name}</div>
        </div>
        {/* dob */}
        <div className="job-row">
          <div className='job-title'>DOB</div>
          <div className="job-name">{data.dob}</div>
        </div>

        {/* trade */}
        <div className="job-row">
          <div className='job-title'>Trade</div>
          <div className="job-name">{data.trade}</div>
        </div>

        {/* References */}
        <div className="job-row">
          <div className='job-title'>References</div>
          <div className="job-name">{data.references}</div>
        </div>

        {/* contact */}
        <div className="job-row">
          <div className='job-title'>Contact</div>
          <div className="job-name">{data.contact}</div>
        </div>
        {/* STATUS */}
        <div className="job-row">
          <div className='job-title'>Status</div>
          <div className="job-name">{data.status}</div>
        </div>
        {/* COMPANY STATUS */}
        <div className="job-row">
          <div className='job-title'>Company Status</div>
          <div className="job-name">{data.companyStatus}</div>
        </div>

        {/* passport No */}
        <div className="job-row">
          <div className='job-title'>Passport No</div>
          <div className="job-name">{data.passportNo}</div>
        </div>

        {/* PASSPORT EXP */}
        <div className="job-row">
          <div className='job-title'>Passport Expire Date</div>
          <div className="job-name">{data.passportExp}</div>
        </div>

        {/* AGENCY */}
        <div className="job-row">
          <div className='job-title'>Agency</div>
          <div className="job-name">{data.agency}</div>
        </div>

        {/* selected */}
        <div className="job-row">
          <div className='job-title'>Selected</div>
          <div className="job-name">{data.selected}</div>
        </div>

        {/* rejected */}
        <div className="job-row">
          <div className='job-title'>Rejected</div>
          <div className="job-name">{data.rejected}</div>
        </div>

        {/* payment */}
        <div className="job-row">
          <div className='job-title'>Payment</div>
          <div className="job-name">{data.payment}</div>
        </div>



{/* position */}
        <div className="job-row">
          <div className='job-title'>Position</div>
          <div className="job-name">{data.position}</div>
        </div>

{/* company */}
<div className="job-row">
          <div className='job-title'>Company</div>
          <div className="job-name">{data.company}</div>
        </div>
        {/* Job Location */}
        <div className="job-row">
          <div className='job-title'>Job Location</div>
          <div className="job-name">{data.jobLocation}</div>
        </div>
        {/* Job Status */}
        <div className="job-row">
          <div className='job-title'>Job Status</div>
          <div className="job-name">{data.jobStatus}</div>
        </div>

{/* Job Type */}
<div className="job-row">
          <div className='job-title'>Job Type</div>
          <div className="job-name">{data.jobType}</div>
        </div>
      </div>

    </Wrapper>
  )
}
export default JobView
