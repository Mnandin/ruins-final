import React, { useState, useRef } from 'react'


export const Audio = (path) => {
  const audio = new Audio(`/ruins-next/public/vol/20190916.mp3`)
  audio.play();
}

export default function Volume() {

 

  const [volume, setVolume] = useState(0) // 初始化音量为0.5
  const audioRef = useRef(null) // 创建一个ref来引用audio元素
  const volumeBarRef = useRef(null); // 创建一个ref来引用音量条

  // 处理鼠标按下事件
  const handleMouseDown = () => {
    setDragging(true);
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (dragging) {
      const volumeBar = volumeBarRef.current;
      const rect = volumeBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const width = volumeBar.offsetWidth;
      const newVolume = Math.min(1, Math.max(0, offsetX / width)); // 计算新的音量
      setVolume(newVolume); // 更新音量
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setDragging(false);
  };

  // 根据音量位置计算按钮的left值
  const buttonStyle = {
    left: `${volume * 100}%`,
  };

  return (
    <>
      <div className="my-12">
        <div className="relative" ref={volumeBarRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <div
            className="volume-bar"
            onMouseDown={handleMouseDown}
          >
          <img src="svg/volbg.svg" className="absolute bottom-0 left-12" />
          </div>
          <img src="svg/volbtn.svg" className='absolute bottom-0 left-24 border-b ' style={buttonStyle} draggable="false"/>
        </div>

        <div className="py-2 flex justify-center mt-2 text-xs font-light font-['IBM Plex Mono'] text-white">
          Global Volume
        </div>
      </div>

      {/* 音频 */}
      <audio ref={audioRef} src='/ruins-next/public/vol/20190916.mp3' autoPlay volume={volume} />
    </>
  )
}
