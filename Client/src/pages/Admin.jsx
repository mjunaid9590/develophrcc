import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';
import { Loading, StatItem } from '../components';
import axios from 'axios';
import { useState } from 'react';

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    return response.data;
  } catch (error) {
    toast.error('You are not authorized to view this page');
    return redirect('/dashboard');
  }
};
// for getting backup  you have to run animation when it is completed then stop it




const Admin = () => {
  const { users, jobs } = useLoaderData();

  // for reading the json file and storing in db
  const [read, setRead] = useState(false)
  const [loading, setLoading] = useState(false)
  const backup = async () => {
    try {
      setLoading(true)
      let data = await axios.get(`/all/data/`, {
        responseType: 'blob',
      });
      console.log(data)
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BackupData.json');
      document.body.appendChild(link);
      link.click();
      setLoading(false)
      toast.success('Backup is successfully done.');
  
    } catch (error) {
      toast.error("Please try agian")
    }
  
  }
  const ReadAndStore = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('jsonFile', e.target.jsonFile.files[0]); // Access the file input by name

      axios.post(`/data/read`, formData).then(async (response) => {
        let res = await response.data;
        console.log(res);
        if (res.done) {
          setLoading(false)
          toast.success(res.message)
          window.reload()
        } else {
          setLoading(false)
          toast.error(res.message)
        }
      });
    } catch (error) {
      setLoading(false)
      toast.error("There is some problem. Please try again.")
    }
  }

  return (
    <>
      <Wrapper>
        {loading?<Loading/>:""}
        <StatItem
          title='current users'
          count={users}
          color='#e9b949'
          bcg='#fcefc7'
          icon={<FaSuitcaseRolling />}
        />
        <StatItem
          title='total jobs'
          count={jobs}
          color='#647acb'
          bcg='#e0e8f9'
          icon={<FaCalendarCheck />}
        />
      </Wrapper>

          <div className="btn-group">
            <button onClick={backup} className='btn'>Get Backup</button>
            <button onClick={() => setRead(!read)} className='btn'>import Data</button>
          </div>
      {/* if true dispaly the form else hide */}
      {read ?
        <>
          <form onSubmit={ReadAndStore} encType="multipart/form-data">
            <input type="file" name="jsonFile" className='form-input' />
            <input type="submit" value="Import" className='btn' style={{margin:"10px"}} />
          </form>
        </> : ""}

   </>
 
  );
};

export default Admin;
