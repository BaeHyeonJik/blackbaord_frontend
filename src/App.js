import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfessorCoursePage from './ProfessorCoursePage';
import MakeCoursePage from './MakeCoursePage';
import MakeLecturePostPage from './MakeLecturePostPage';
import StreamPage from './StreamPage';
import StudentCoursePage from './StudentCoursePage';
import LectureRegisterPage from './LectureRegisterPage';
import GetLecturePostPage from './GetLecturePostPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/professor/course" element={<ProfessorCoursePage />} />
          <Route path="/professor/course/make" element={<MakeCoursePage />} />
          <Route path="/professor/course/:course_title/post" element={<MakeLecturePostPage />} />
          <Route path="/student/stream" element={<StreamPage />} />
          <Route path="/student/course" element={<StudentCoursePage />} />
          <Route path="/student/register" element={<LectureRegisterPage />} />
          <Route path="/student/course/:lecture_title/post" element={<GetLecturePostPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;