/**
 * 最小化App组件 - 用于调试白屏问题
 */

import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>FlexiResume - 最小化测试</h1>
      <p>如果你能看到这个页面，说明基本的React应用是正常的。</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;
