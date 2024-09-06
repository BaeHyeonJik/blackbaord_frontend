import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentCoursePage() {
  const [student, setStudent] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    setStudent({
      id: userInfo.id,
      name: userInfo.name,
    });
    fetchStudentLectures(userInfo);
  }, [navigate]);

  const fetchStudentLectures = async (userInfo) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getStudentLectures/${userInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (response.statusCode === 200) {
        setLectures(response.list);
      } else {
        console.error('Failed to fetch lectures:', response.err);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleStreamClick = () => {
    navigate('/student/stream');
  };

  const handleCourseClick = () => {
    navigate('/student/course');
  };

  const handleRegisterClick = () => {
    navigate('/student/register');
  };

  const handleViewPostClick = (lecture) => {
    localStorage.setItem('lecture', JSON.stringify({
      id: lecture.id,
      title: lecture.title
    }));
    
    navigate(`/student/course/${lecture.title}/post`);
  };

  const handleUnregisterClick = async (lectureId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteRegister/${lectureId}/${student.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: student.id, lecture_id: lectureId }),
      }).then((res) => res.json());

      if (response.statusCode === 200) {
        fetchStudentLectures(student);
      } else {
        console.error('Failed to unregister:', response.message);
      }
    } catch (error) {
      console.error('Error unregistering lecture:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogoutClick}>로그아웃</button>
      <button onClick={handleStreamClick}>스트림</button>
      <button onClick={handleCourseClick}>코스</button>
      <button onClick={handleRegisterClick}>수강신청</button>
      <h1>{student?.name} 학생의 코스</h1>
      <br />
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>강의 제목</th>
            <th>학점</th>
            <th>인원 (현재/최대)</th>
            <th>게시물 보기</th>
            <th>수강포기</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture) => (
            <tr key={lecture.id}>
              <td>{lecture.title}</td>
              <td>{lecture.credit}</td>
              <td>{lecture.studentnum} / {lecture.limitednum}</td>
              <td>
                <button onClick={() => handleViewPostClick(lecture)}>게시물보기</button>
              </td>
              <td>
                <button onClick={() => handleUnregisterClick(lecture.id)}>수강포기하기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentCoursePage;
