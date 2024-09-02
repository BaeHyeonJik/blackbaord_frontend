import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [list, setFormData] = useState({
    password: '',
    confirmPassword: '',
    name: '',
    num: '',
    role: 'student',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...list,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!list.user_id) newErrors.user_id = '아이디를 입력해주세요.';
    if (!list.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (list.password !== list.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!list.name) newErrors.name = '이름을 입력해주세요.';
    if (!list.num) newErrors.num = '학번을 입력해주세요.';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const data = await fetch('http://localhost:8080/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ list: list }),
        }).then((res) => res.json())
          .catch((error) => console.error('Error:', error));
        
        const statusCode = data.statusCode;

        if (statusCode === 200) {
          navigate('/');
        } else if (statusCode === 409) {
          setErrors({ submit: '아이디가 중복됩니다.' });
        } else {
          setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
        }
      } catch (error) {
        console.error('회원가입 요청 중 오류 발생:', error);
        setErrors({ submit: '회원가입 요청 중 오류가 발생했습니다.' });
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디:</label>
          <input
            type="text"
            name="user_id"
            value={list.user_id}
            onChange={handleChange}
          />
          {errors.user_id && <span style={{ color: 'red' }}>{errors.user_id}</span>}
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={list.password}
            onChange={handleChange}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <div>
          <label>비밀번호 확인:</label>
          <input
            type="password"
            name="confirmPassword"
            value={list.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
        </div>
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="name"
            value={list.name}
            onChange={handleChange}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>
        <div>
          <label>학번:</label>
          <input
            type="text"
            name="num"
            value={list.num}
            onChange={handleChange}
          />
          {errors.num && <span style={{ color: 'red' }}>{errors.num}</span>}
        </div>
        <div>
          <label>역할:</label>
          <select
            name="role"
            value={list.role}
            onChange={handleChange}
          >
            <option value="student">학생</option>
            <option value="professor">교수</option>
          </select>
        </div>
        <button type="submit">회원가입</button>
        {errors.submit && <span style={{ color: 'red' }}>{errors.submit}</span>}
      </form>
      <button onClick={handleBack}>뒤로가기</button> {/* 뒤로가기 버튼 */}
    </div>
  );
};

export default SignupPage;
