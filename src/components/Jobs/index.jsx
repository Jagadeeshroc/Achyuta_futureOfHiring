import React from "react";
import JobsDetails from "../JobsItem";
import ColorRingsLoader from '../Loader';

class Jobs extends React.Component {
    state = { jobsData: [], isLoading: true };

    componentDidMount() {
        this.getJobDetails();
    }

    getJobDetails = async () => { 
        const response = await fetch('https://jsonfakery.com/jobs/random/3');
        const data = await response.json();
        const updatedData = data.map(eachItem => ({
            id: eachItem.id,
            title: eachItem.title,
            description: eachItem.description,
            company: eachItem.company,
            location: eachItem.location,
            salaryFrom: eachItem.salary_from,
            salaryTo: eachItem.salary_to,
            employmentType: eachItem.employment_type,
            applicationDeadline: eachItem.application_deadline,
            qualifications: eachItem.qualifications,
            contact: eachItem.contact,
            jobCategory: eachItem.job_category,
            isRemoteWork: eachItem.is_remote_work,
            numberOfOpening: eachItem.number_of_opening,
            createdAt: eachItem.created_at,
            updatedAt: eachItem.updated_at
        }));
        this.setState({ jobsData: updatedData, isLoading: false });
        console.log(updatedData);
    }

    render() {
        const { jobsData, isLoading } = this.state;
        return (
            <div className="job-listsContainer">
                {isLoading ? <ColorRingsLoader /> : jobsData.map(item => (
                    <JobsDetails jobsData={item} key={item.id} />
                ))}
            </div>
        ); 
    }
}
export default Jobs;
