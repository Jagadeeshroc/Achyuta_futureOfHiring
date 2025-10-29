import { useNavigate } from 'react-router-dom'
import JobForm from './JobForm'


export default function CreateJob() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/jobs')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
      <JobForm onSuccess={handleSuccess} />
      
    </div>
  )
}