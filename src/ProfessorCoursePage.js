import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfessorCoursePage() {
  const [professor, setProfessor] = useState(null);
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

    setProfessor({
      id: userInfo.id,
      name: userInfo.name,
    });

    const fetchData = async () => {
      try {
        const lectureResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/getProfessorLectures/${userInfo.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then((response) => response.json());

        if (lectureResponse.statusCode === 200) {
          setLectures(lectureResponse.list);
        } else {
          console.error('Failed to fetch lectures:', lectureResponse.err);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePostClick = (lecture) => {
    localStorage.setItem('lecture', JSON.stringify({
      id: lecture.id,
      title: lecture.title
    }));
    navigate(`/professor/course/${lecture.title}/post`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogoutClick}>로그아웃</button>
      <h1>{professor?.name} 교수님 코스 목록</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>강의 제목</th>
            <th>학점</th>
            <th>인원 (현재/최대)</th>
            <th>게시물 작성</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture) => (
            <tr key={lecture.id}>
              <td>{lecture.title}</td>
              <td>{lecture.credit}</td>
              <td>{lecture.studentnum} / {lecture.limitednum}</td>
              <td>
                <button onClick={() => handlePostClick(lecture)}>게시물 작성</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessorCoursePage;
