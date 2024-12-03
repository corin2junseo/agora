const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키를 포함하여 요청
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json(); // 응답을 JSON으로 파싱
      // 로그아웃 성공 후 처리
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
    }
  };
  