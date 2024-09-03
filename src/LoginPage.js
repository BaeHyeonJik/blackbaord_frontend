import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [user_id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
      const list = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          password,
        }),
      }).then((response) => response.json());

      if (list.statusCode === 200) {
        localStorage.setItem('user', JSON.stringify(list.user_Info));
        if (list.user_Info.role === 'student') {
          navigate(`/student/${list.user_Info.name}`);
        } else if (list.user_Info.role === 'professor') {
          navigate(`/professor/${list.user_Info.name}`);
        }
      } else if (list.statusCode === 409) {
        setErrorMessage('아이디 혹은 비밀번호를 다시 확인해주세요.');
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* 오류 메시지 표시 */}
      </form>
      <button onClick={handleSignupRedirect}>회원가입</button> {/* 회원가입 버튼 추가 */}
    </div>
  );
};

export default LoginPage;
