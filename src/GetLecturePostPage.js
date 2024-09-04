import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetLecturePostPage() {
  const [lectureInfo, setLectureInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedLectureInfo = JSON.parse(localStorage.getItem('lecture'));

    if (storedLectureInfo) {
      setLectureInfo(storedLectureInfo);
      fetchBoardPosts(storedLectureInfo.id);
    } else {
      console.error('No user or lecture info found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchBoardPosts = async (lectureId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getStudentLecturePosts/${lectureId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json());
      if (response.statusCode === 200) {
        setPosts(response.list);
      } else {
        console.error('Failed to fetch posts:', response.err);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/student/course`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{lectureInfo.title} 게시물 페이지</h1>
      <button onClick={handleBackButtonClick}>뒤로가기</button>
      <h2>게시글 목록</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>작성자</th>
            <th>제목</th>
            <th>내용</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
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

export default GetLecturePostPage;
