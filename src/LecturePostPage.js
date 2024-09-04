import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function LecturePostPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [lectureInfo, setLectureInfo] = useState(null);
  const [boardContent, setBoardContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('user'));
    const storedLectureInfo = JSON.parse(localStorage.getItem('lecture'));

    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      setLectureInfo(storedLectureInfo);
      fetchBoardPosts(storedLectureInfo.id);
    } else {
      console.error('No user info found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchBoardPosts = async (lectureId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getProfessorLecturePosts/${lectureId}`, {
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

  const handlePostSubmit = async () => {
    if (!postTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!boardContent.trim()) {
      alert('게시글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/insertLecturePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prof_id: userInfo.id,
          lecture_id: lectureInfo.id,
          post_title: postTitle,
          content: boardContent, // Rich Text 데이터
        }),
      }).then((response) => response.json());
      if (response.statusCode === 200) {
        setPostTitle('');
        setBoardContent('');
        fetchBoardPosts(lectureInfo.id);
      } else {
        console.error('Failed to create post:', response.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      console.log(postId);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteLecturePost/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json());
      if (response.statusCode === 200) {
        fetchBoardPosts(lectureInfo.id);
      } else {
        console.error('Failed to delete post:', response.err);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleBackButtonClick = () => {
    navigate(`/professor/${userInfo.name}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{lectureInfo.title} 게시물 관리 페이지</h1>
      <button onClick={handleBackButtonClick}>뒤로가기</button>
      <h2>게시판</h2>
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      <br/>
      <ReactQuill
        value={boardContent}
        onChange={setBoardContent}
        placeholder="게시글을 입력하세요"
        modules={modules}
        formats={formats}
      />
      <br />
      <button onClick={handlePostSubmit}>게시글 작성</button>

      <h3>게시글 목록</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>작성자</th>
            <th>제목</th>
            <th>내용</th>
            <th>작성일</th>
            <th>삭제하기</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.board_id}>
              <td>{post.name}</td>
              <td>{post.post_title}</td>
              <td dangerouslySetInnerHTML={{ __html: post.content }}></td>
              <td>{post.created_at}</td>
              <td>
                <button onClick={() => handleDeletePost(post.board_id)}>삭제하기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ 'align': [] }],
    ['clean']                                         
  ],
};

const formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'align', 'clean'
];

export default LecturePostPage;
