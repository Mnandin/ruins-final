import useStreamInfo from "@/contexts/use-streamInfo";
import { socket } from "@/src/socket";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useState } from 'react';
import styles from './title.module.css';

export default function Title() {
  const { streamTitle, streamDesciption, setStreamTitle, setStreamDesciption } = useStreamInfo()
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = () => {
    setShowDetail(!showDetail)
  }

  useEffect(() => {
    socket.on('setTitle', (title, description) => {
      setStreamTitle(title)
      setStreamDesciption(description)
    })
  }, [])

  return (
    <div className={styles['title-container']}>
      {!streamDesciption ? "" : showDetail ?
        <RiArrowRightSLine
          onClick={handleShowDetail} />
        :
        <RiArrowDownSLine
          onClick={handleShowDetail} />
      }
      <div>
        <div className='flex items-center'>
          <div className='text-xl font-semibold max-md:text-base'>{streamTitle}</div>

        </div>
        <div className={`font-semibold text-sm max-md:w-[300px] ${showDetail ? "block" : "hidden"}`}
        >{streamDesciption}</div>
      </div>
    </div>
  )
}
