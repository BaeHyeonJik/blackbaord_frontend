import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfessorPage from './ProfessorPage';
import LecturePostPage from './LecturePostPage';
import StudentPage from './StudentPage';
import LectureRegisterPage from './LectureRegisterPage';
import GetLecturePostPage from './GetLecturePostPage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/professor/:professor_name" element={<ProfessorPage />} />
                    <Route path="/professor/:professor_name/:course_title" element={<LecturePostPage />} />
                    <Route path="/student/:student_name" element={<StudentPage />} />
                    <Route path="/student/:student_name/register" element={<LectureRegisterPage />} />
                    <Route path="/student/:student_name/:lecture_title/post" element={<GetLecturePostPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;