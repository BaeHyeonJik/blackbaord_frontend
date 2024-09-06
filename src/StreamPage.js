import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StreamPage() {
  const [student, setStudent] = useState(null);
  const [posts, setPosts] = useState([]);
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
    fetchStudentPosts(userInfo);
  }, [navigate]);

  const fetchStudentPosts = async (userInfo) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getStudentAllLecturePosts/${userInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (response.statusCode === 200) {
        setPosts(response.list);
      } else {
        console.error('Failed to fetch posts:', response.err);
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

  const handleCourseClick = () => {
    navigate('/student/course');
  };
  const handleRegisterClick = () => {
    navigate('/student/register');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogoutClick}>로그아웃</button>
      <button onClick={handleCourseClick}>코스</button>
      <button onClick={handleRegisterClick}>수강신청</button>
      <h1>{student?.name} 학생의 스트림</h1>
      <br /><br />
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>강의명</th>
            <th>작성자</th>
            <th>게시물 제목</th>
            <th>게시물 내용</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.board_id}>
              <td>{post.lecture_title}</td>
              <td>{post.prof_name}</td>
              <td>{post.post_title}</td>
              <td dangerouslySetInnerHTML={{ __html: post.content }}></td>
              <td>{post.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StreamPage;
