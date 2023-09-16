// import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useParams } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE, STATUS, SELECTED, PAYMENT, REJECTED, VISA_STATUS,  } from "../utils/constants"
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const singleJobQuery = (id) => {
  return {
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`);
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleJobQuery(params.id));
      return params.id;
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return redirect('/dashboard/all-jobs');
    }
  };
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/jobs/${params.id}`, data);
      queryClient.invalidateQueries(['jobs']);

      toast.success('Job edited successfully');
      return redirect('/dashboard/all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const EditJob = () => {
  const id = useLoaderData();
  const [data, setData] = useState()
  const {
    data: { job },
  } = useQuery(singleJobQuery(id));
  const Handler = (e) => {
    setData(pre => ({
      ...pre,
      [e.target.name]: e.target.value
    }));
  };


  useEffect(()=>{
    if(job){
      setData({
        name: job.name, f_Name:job.f_Name, trade: job.trade, passportExp: job.passportExp,
         dob: job.dob, 
         references: job.references, contact:job.contact, status: job.status, companyStatus: job.companyStatus, agency:job.agency,
        selected: job.selected, rejected: job.rejected, payment: job.payment, passportNo:job.passportNo, visaStatus:job.visaStatus,
        position: job.position, company: job.company, jobStatus: job.jobStatus, jobLocation: job.jobLocation, jobType: job.jobType
            })
    }
  },[])
  return (
    <Wrapper>
    <Form  method='post' className='form' encType="multipart/form-data">
      <h4 className='form-title'>add User</h4>

      {job? data?<>
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
          <input type="text" onChange={Handler} value={data.references} className='form-input' name="references" required />
        </div>
      
        {/* contact */}
        <div className="form-row">
          <label htmlFor="contact" className='form-label'>Contact</label>
          <input type="text" onChange={Handler} value={data.contact} className='form-input' name="contact" required />
        </div>
        {/* STATUS */}
        <div className="form-row">
          <label htmlFor="status" className='form-label'>Status</label>
          <select name="status" id="status" className='form-input' onChange={Handler} value={data.status} required>
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
          <select name="visaStatus" id="visaStatus" value={data.visaStatus} className='form-input' onChange={Handler} required>
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
          <select name="selected" id="selected" value={data.selected} className='form-input' onChange={Handler} required>
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
          <select name="rejected" value={data.rejected} id="rejected" className='form-input' onChange={Handler} required>
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
          <select name="payment" value={data.payment} id="payment" className='form-input' onChange={Handler} required>
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
          <input type="text" className='form-input' value={data.position} name="position" onChange={Handler} />
        </div>
        <div className="form-row">
          <label htmlFor="company" className='form-label'>Company</label>
          <input type="text" className='form-input' value={data.company} name="company" onChange={Handler} />
        </div>
        <div className="form-row">
          <label htmlFor="jobLocation" className='form-label'>Job Location</label>
          <input type="text" className='form-input'value={data.jobLocation} onChange={Handler} name="jobLocation" />
        </div>

        {/* select option */}
        <div className="form-row">
          <div className="form-label">Job Status</div>
          <select name="jobStatus" value={data.jobStatus} id="jobStatus" className='form-input' onChange={Handler} required>
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
          <select name="jobType" value={data.jobType} id="jobType" className='form-input' onChange={Handler} required>
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



      
        <div className='form-row' style={{height:"100%", display:'flex', justifyContent:"center", alignItems:"end"}}>
        <input type="submit" value={"Update"} className='btn btn-block ' />
        </div>

      
      </div>
      </>:"":""}
    </Form>

  </Wrapper>



    // <Wrapper>
    //   <Form method='post' className='form'>
    //     <h4 className='form-title'>edit job</h4>
    //     <div className='form-center'>
    //       <FormRow type='text' name='position' defaultValue={job.position} />
    //       <FormRow type='text' name='company' defaultValue={job.company} />
    //       <FormRow
    //         type='text'
    //         name='jobLocation'
    //         labelText='job location'
    //         defaultValue={job.jobLocation}
    //       />
    //       <FormRowSelect
    //         name='jobStatus'
    //         labelText='job status'
    //         defaultValue={job.jobStatus}
    //         list={Object.values(JOB_STATUS)}
    //       />
    //       <FormRowSelect
    //         name='jobType'
    //         labelText='job type'
    //         defaultValue={job.jobType}
    //         list={Object.values(JOB_TYPE)}
    //       />
    //       <SubmitBtn formBtn />
    //     </div>
    //   </Form>
    // </Wrapper>
  );
};
export default EditJob;
