import { useState } from 'react';
import './Goals.css'; // Create this CSS file for styling
import {Link} from 'react-router-dom'

const Goal = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: "Update resume with latest projects", completed: false },
    { id: 2, text: "Complete 5 coding challenges", completed: false },
    { id: 3, text: "Network with 3 professionals in my field", completed: false }
  ]);
  
  const [newGoal, setNewGoal] = useState("");
  const [motivationalMessage, setMotivationalMessage] = useState("Your dream job is waiting! Keep pushing forward!");

  const motivationalMessages = [
    "Every small step brings you closer to your dream job!",
    "You've got this! Your skills are valuable.",
    "Consistency is key - keep working on your goals!",
    "Today's effort is tomorrow's achievement!",
    "The tech industry needs someone exactly like you!"
  ];

  const addGoal = () => {
    if (newGoal.trim() !== "") {
      setGoals([...goals, { id: Date.now(), text: newGoal, completed: false }]);
      setNewGoal("");
      // Change motivational message randomly when adding a goal
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setMotivationalMessage(motivationalMessages[randomIndex]);
    }
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="goal-container">
      <button className='bg-blue-50 p-2 m-2 ' ><Link to='/myProfile'><span className='text-2xl no-underline!'>back</span></Link></button>
      <header className="goal-header">
        <h1>My Career Goals</h1>
        <p className="motivational-message">{motivationalMessage}</p>
      </header>
      
      <div className="progress-section">
        <h2>Progress Tracker</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(goals.filter(g => g.completed).length / goals.length) * 100}%` }}
          ></div>
        </div>
        <p>{goals.filter(g => g.completed).length} of {goals.length} goals completed</p>
      </div>
      
      <div className="add-goal">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new career goal..."
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>
      
      <div className="goals-list">
        <h2>My Job Preparation Checklist</h2>
        <ul>
          {goals.length === 0 ? (
            <p className="empty-message">No goals yet. Add your first career goal above!</p>
          ) : (
            goals.map(goal => (
              <li key={goal.id} className={goal.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                />
                <span>{goal.text}</span>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="Delete goal"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <div className="tips-section">
        <h2>Job Search Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>📝 Resume</h3>
            <p>Tailor your resume for each application, highlighting relevant skills.</p>
          </div>
          <div className="tip-card">
            <h3>💻 Portfolio</h3>
            <p>Showcase 3-5 strong projects that demonstrate your capabilities.</p>
          </div>
          <div className="tip-card">
            <h3>🔍 Networking</h3>
            <p>Connect with professionals and engage in industry discussions.</p>
          </div>
          <div className="tip-card">
            <h3>📚 Learning</h3>
            <p>Dedicate time daily to learn new technologies in your field.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goal;