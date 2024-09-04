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
      console.log(user_id, password);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          password,
        }),
      });

      const list = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(list.user_Info));
        if (list.user_Info.role === 'student') {
          navigate(`/student/${list.user_Info.name}`);
        } else if (list.user_Info.role === 'professor') {
          navigate(`/professor/${list.user_Info.name}`);
        }
      } else if (response.status === 409) {
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
