// import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE, PAYMENT, REJECTED, SELECTED, STATUS, VISA_STATUS } from '../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useState } from 'react';
import axios from 'axios';

export const action =
  (queryClient) =>
    async ({ request }) => {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);
      try {
        await customFetch.post('/jobs', data);
        queryClient.invalidateQueries(['jobs']);
        toast.success('Job added successfully ');
        return redirect('all-jobs');
      } catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
      }
    };

const AddJob = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "", f_Name: "", trade: "", passportExp: new Date().toLocaleDateString(), dob: new Date().toLocaleDateString(), 
    references: "", contact: "", status: STATUS.ACTIVE, companyStatus: "", agency: "",
    selected: SELECTED.DONE, rejected:REJECTED.DONE, payment: PAYMENT.NONE, passportNo:"", visaStatus:VISA_STATUS.CANCELED,
    passport: null, ticket: null, protector: null, visa: null,
    position: "", company: "", jobStatus: JOB_STATUS.PENDING, jobLocation: "", jobType: JOB_TYPE.FULL_TIME
  })
  const HandlerFile = (e) => {
    setData(pre => ({
      ...pre,
      [e.target.name]: e.target.files[0],
    }));
  };
  const Handler = (e) => {
    setData(pre => ({
      ...pre,
      [e.target.name]: e.target.value
    }));
  };


  const Submit = (e) => {
    e.preventDefault();
    if (data.position && data.jobStatus && data.jobType && data.jobLocation && data.company) {
      const formData = new FormData();
      formData.append("visaStatus",data.visaStatus) 
      formData.append("passportNo",data.passportNo) 
      formData.append("rejected",data.rejected) 
      formData.append("selected",data.selected) 
      formData.append("agency",data.agency) 
      formData.append("companyStatus",data.companyStatus) 
      formData.append("status",data.status) 
      formData.append("contact",data.contact) 
      formData.append("references",data.referneces) 
      formData.append("dob",data.dob)
      formData.append("passportExp",data.passportExp)
      formData.append("trade",data.trade)
      formData.append("f_Name",data.f_Name)
      formData.append("name",data.name)
      formData.append("passport", data.passport)
      formData.append("ticket", data.ticket)
      formData.append("protector", data.protector)
      formData.append("position", data.position)
      formData.append("visa", data.visa)
      formData.append("company", data.company)
      formData.append("jobStatus", data.jobStatus)
      formData.append("jobLocation", data.jobLocation)
      formData.append("jobType", data.jobType)
      axios.post("/new/job", formData).then(async (response) => {
        let res = await response.data;
        console.log(res)
        if (res.done) {
          toast.success("The Information is added successful.")
          navigate("/dashboard/all-jobs")
        } else {
          toast.error(res.message ? res.message : "There is some problem. Please try again later.")
        }
      })
    } else {
      toast.error("Please first fill all fields.")
    }
  }
  return (
    <Wrapper>
      <Form onSubmit={Submit} className='form' encType="multipart/form-data">
        <h4 className='form-title'>Add User</h4>

        <div className='form-center'>
          {/* images get */}

          {/* name */}
          <div className="form-row">
            <label htmlFor="name" className='form-label'>Name</label>
            <input type="text" onChange={Handler} value={data.name} className='form-input' name="name" required />
          </div>
          {/* f_name */}
          <div className="form-row">
            <label htmlFor="f_Name" className='form-label'>Father Name</label>
            <input type="text" onChange={Handler} value={data.f_Name} className='form-input' name="f_Name" required />
          </div>
          {/* dob */}
          <div className="form-row">
            <label htmlFor="dob" className='form-label'>Date of Birth</label>
            <input type="date" onChange={Handler} value={data.dob} className='form-input' name="dob" required />
          </div>

          {/* trade */}
          <div className="form-row">
            <label htmlFor="trade" className='form-label'>Trade</label>
            <input type="text" onChange={Handler} value={data.trade} className='form-input' name="trade" required />
          </div>

          {/* References */}
          <div className="form-row">
            <label htmlFor="references" className='form-label'>References</label>
            <input type="text" onChange={Handler} value={data.referneces} className='form-input' name="references" required />
          </div>

          {/* contact */}
          <div className="form-row">
            <label htmlFor="contact" className='form-label'>Contact</label>
            <input type="text" onChange={Handler} value={data.contact} className='form-input' name="contact" required />
          </div>
          {/* STATUS */}
          <div className="form-row">
            <label htmlFor="status" className='form-label'>Status</label>
            <select name="status" id="status" className='form-input' onChange={Handler} required>
              {
                STATUS ? <>
                  {
                    Object.values(STATUS).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>
          {/* COMPANY STATUS */}
          <div className="form-row">
            <label htmlFor="companyStatus" className='form-label'>Company Status</label>
            <input type="text" onChange={Handler} value={data.companyStatus} className='form-input' name="companyStatus" required />
          </div>

{/* passport No */}
          <div className="form-row">
            <label htmlFor="passportNo" className='form-label'>Passport No</label>
            <input type="text" onChange={Handler} value={data.passportNo} className='form-input' name="passportNo" required />
          </div>
       
       {/* PASSPORT EXP */}
          <div className="form-row">
            <label htmlFor="passportExp" className='form-label'>Passport Expire</label>
            <input type="date" onChange={Handler} value={data.passportExp} className='form-input' name="passportExp" required />
          </div>
{/* visi Status */}
          <div className="form-row">
            <label htmlFor="visaStatus" className='form-label'>Visa Status</label>
            <select name="visaStatus" id="visaStatus" className='form-input' onChange={Handler} required>
              {
                VISA_STATUS ? <>
                  {
                    Object.values(VISA_STATUS).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>
          {/* AGENCY */}
          <div className="form-row">
            <label htmlFor="agency" className='form-label'>Agency</label>
            <input type="text" onChange={Handler} value={data.agency} className='form-input' name="agency" required />
          </div>

          {/* selected */}
          <div className="form-row">
            <label htmlFor="selected" className='form-label'>Selected</label>
            <select name="selected" id="selected" className='form-input' onChange={Handler} required>
              {
                SELECTED ? <>
                  {
                    Object.values(SELECTED).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>

          {/* rejected */}
          <div className="form-row">
            <label htmlFor="rejected" className='form-label'>Rejected</label>
            <select name="rejected" id="rejected" className='form-input' onChange={Handler} required>
              {
                REJECTED ? <>
                  {
                    Object.values(REJECTED).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>

          {/* payment */}
          <div className="form-row">
            <label htmlFor="payment" className='form-label'>Payment</label>
            <select name="payment" id="payment" className='form-input' onChange={Handler} required>
              {
                PAYMENT ? <>
                  {
                    Object.values(PAYMENT).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>



    
          <div className="form-row">
            <label htmlFor="position" className='form-label'>Position</label>
            <input type="text" className='form-input' name="position" onChange={Handler} required/>
          </div>
          <div className="form-row">
            <label htmlFor="company" className='form-label'>Company</label>
            <input type="text" className='form-input' name="company" onChange={Handler} required/>
          </div>
          <div className="form-row">
            <label htmlFor="jobLocation" className='form-label'>Job Location</label>
            <input type="text" className='form-input' onChange={Handler} name="jobLocation" required/>
          </div>

          {/* select option */}
          <div className="form-row">
            <div className="form-label">Job Status</div>
            <select name="jobStatus" id="jobStatus" className='form-input' onChange={Handler} required>
              {
                JOB_STATUS ? <>
                  {
                    Object.values(JOB_STATUS).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>

          <div className="form-row">
            <div className="form-label">Job Type</div>
            <select name="jobType" id="jobType" className='form-input' onChange={Handler} required>
              {
                JOB_TYPE ? <>
                  {
                    Object.values(JOB_TYPE).map((d, i) => {
                      return (
                        <option value={d} key={i}>{d}</option>
                      )
                    })
                  }
                </> : ""
              }
            </select>
          </div>



          <div className="form-row">
            <label htmlFor="passport" className='form-label'>Passport</label>
            <input type="file" onChange={HandlerFile} className='form-input' name="passport" required />
          </div>
          <div className="form-row">
            <label htmlFor="visa" className='form-label'>Visa</label>
            <input type="file" onChange={HandlerFile} className='form-input' name="visa" required />
          </div>
          <div className="form-row">
            <label htmlFor="ticket" className='form-label'>Ticket</label>
            <input type="file" onChange={HandlerFile} className='form-input' name="ticket" required />
          </div>
          <div className="form-row">
            <label htmlFor="protector" className='form-label'>Protector</label>
            <input type="file" onChange={HandlerFile} className='form-input' name="protector" required />
          </div>

          <input type="submit" className='btn btn-block' />

          {/* <FormRow type='file' name='ticket' />
        <FormRow type='file' name='passport' />
        <FormRow type='file' name='visa' />
        <FormRow type='file' name='protector' />

          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText='job status'
            name='jobStatus'
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            labelText='job type'
            name='jobType'
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn /> */}
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddJob;
