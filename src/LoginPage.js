import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [user_id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          password,
        }),
      }).then((response) => response.json());

      if (response.statusCode === 200) {
        localStorage.setItem('user', JSON.stringify(response.user_Info));
        if (response.user_Info.role === 'student') {
          navigate(`/student/stream`);
        } else if (response.user_Info.role === 'professor') {
          navigate(`/professor/course`);
        }
      } else if (response.status === 401) {
        alert('아이디 혹은 비밀번호를 다시 확인해주세요.');
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>ID</label>
          <input 
            type="text" 
            value={user_id} 
            onChange={handleIdChange} 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignupRedirect}>회원가입</button>
    </div>
  );
};

export default LoginPage;
