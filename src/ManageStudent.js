import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageStudent() {
  const [students, setStudents] = useState([]);
  const [lectureInfo, setLectureInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLectureInfo = JSON.parse(localStorage.getItem('lecture'));

    if (storedLectureInfo) {
      setLectureInfo(storedLectureInfo);
      fetchStudentList(storedLectureInfo.id);
    } else {
      console.error('No lecture info found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchStudentList = async (lectureId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getAllTakingStudent/${lectureId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json());
      if (response.statusCode === 200) {
        setStudents(response.list);
      } else {
        console.error('Failed to fetch student list:', response.err);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregisterClick = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteRegister/${lectureInfo.id}/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, lecture_id: lectureInfo.id }),
      }).then((res) => res.json());

      if (response.statusCode === 200) {
        fetchStudentList(lectureInfo.id);
      } else {
        console.error('Failed to unregister student:', response.message);
      }
    } catch (error) {
      console.error('Error unregistering student:', error);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/professor/course`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{lectureInfo.title} 수강 학생 목록</h1>
      <button onClick={handleBackButtonClick}>뒤로가기</button>
      
      <h3>학생 목록</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>수강학생삭제</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.num}</td>
              <td>
                <button onClick={() => handleUnregisterClick(student.id)}>수강학생삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStudent;
