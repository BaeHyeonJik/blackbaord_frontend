import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LectureRegisterPage() {
  const [student, setStudent] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllLectures = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getAllLectures`, {
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
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setStudent({
        id: userInfo.id,
        name: userInfo.name,
      });
      fetchAllLectures();
    } else {
      console.error('No user info found in localStorage');
      setLoading(false);
    }
  }, []);

  const handleRegisterClick = async (lectureId) => {
    if (!student) {
      console.error('Student info is missing');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/insertRegister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: student.id,
          lecture_id: lectureId,
        }),
      }).then((res) => res.json());

      if (response.statusCode === 200) {
        fetchAllLectures();
      } else if (response.statusCode === 409) {
        alert('이미 수강신청된 강의입니다.');
      } else {
        console.error('Failed to enroll:', response.err);
      }
    } catch (error) {
      console.error('Error enrolling in lecture:', error);
    }
  };

  const handleBackClick = () => {
    if (student) {
      navigate(`/student/${student.name}`);
    } else {
      console.error('Student info is missing');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleBackClick}>뒤로가기</button>
      <h1>강의 목록</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>강의 제목</th>
            <th>교수명</th>
            <th>학점</th>
            <th>인원 (현재/최대)</th>
            <th>상태</th>
            <th>수강신청</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture) => (
            <tr key={lecture.id}>
              <td>{lecture.title}</td>
              <td>{lecture.prof_name}</td>
              <td>{lecture.credit}</td>
              <td>{lecture.studentnum} / {lecture.limitednum}</td>
              <td>{lecture.status}</td>
              <td>
                {lecture.status === '모집중' ? (
                  <button onClick={() => handleRegisterClick(lecture.id)}>
                    수강신청
                  </button>
                ) : (
                  <span>마감</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LectureRegisterPage;
