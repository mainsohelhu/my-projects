import { useEffect, useState } from "react";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- CONFIG: Isko true/false karke check kar sakte ho ---
const isRecruiter = localStorage.getItem("role") === "recruiter";

  const fetchJobs = () => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data.jobs))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchJobs(); }, []);

  const deleteJob = (id) => {
    if(window.confirm("Bhai, pakka uda du?")) {
      axios.delete(`http://localhost:5000/api/jobs/${id}`)
        .then(() => {
          alert("Job deleted! 🗑️");
          fetchJobs();
        })
        .catch(err => alert("Error deleting job"));
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search by title or company..." 
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="job-list">
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h2>{job.title}</h2>
            <p><strong>🏢 {job.company}</strong> | 📍 {job.location}</p>
            <p>💰 {job.salary}</p>
            <p>{job.description}</p>
            
            <div className="button-group" style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
              
              {/* Apply Button: Sabko dikhega */}
              <a href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`} className="apply-btn">
                Apply Now ✉️
              </a>

              {/* Delete Button: Sirf tab dikhega jab isRecruiter true ho */}
              {isRecruiter && (
                <button onClick={() => deleteJob(job._id)} className="delete-btn">
                  Delete 🗑️
                </button>
              )}

            </div>
          </div>
        )) : <p>No jobs found 😅</p>}
      </div>
    </div>
  );
};

export default JobList;