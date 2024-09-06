import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MakeCoursePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [limitedNum, setLimitedNum] = useState('');
  const [credit, setCredit] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('user'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      alert('로그인이 필요합니다.');
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const handleCourseSubmit = async () => {
    if (!courseTitle.trim() || !limitedNum || !credit) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/insertCourse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prof_id: userInfo.id,
          title: courseTitle,
          limitednum: parseInt(limitedNum),
          credit: parseInt(credit),
        }),
      }).then((response) => response.json());

      if (response.statusCode === 200) {
        alert('코스가 성공적으로 생성되었습니다.');
        navigate('/professor/course');
      } else {
        console.error('Failed to create course:', response.err);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleBackButtonClick = () => {
    navigate('/professor/course');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>코스 생성 페이지</h1>
      <button onClick={handleBackButtonClick}>뒤로가기</button>
      <div>
        <label>코스 제목:</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="코스 제목을 입력하세요"
        />
      </div>
      <div>
        <label>최대 인원:</label>
        <input
          type="number"
          value={limitedNum}
          onChange={(e) => setLimitedNum(e.target.value)}
          placeholder="최대 인원을 입력하세요"
        />
      </div>
      <div>
        <label>학점:</label>
        <input
          type="number"
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          placeholder="학점을 입력하세요"
        />
      </div>
      <br />
      <button onClick={handleCourseSubmit}>코스 생성</button>
    </div>
  );
}

export default MakeCoursePage;
