import React, { useEffect, useState } from 'react'
import { API_SERVER } from './config/api-path'
import {
  RiChat4Fill,
  RiEyeFill,
  RiDeleteBinLine,
  RiMoreFill,
  RiArrowRightDoubleLine,
  RiArrowLeftDoubleLine,
  RiHeartFill,
} from '@remixicon/react'
import Image from 'next/image'
import img from './img/1868140_screenshots_20240115034222_1.jpg'
import Link from 'next/link'
import { useBoards } from '@/contexts/use-boards'
import { useToggles } from '@/contexts/use-toggles'
import { SN_DELETE_POST, SN_PSPOSTS } from './config/api-path'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

export default function PersonalContent() {
  const router = useRouter()
  const { handlePostId, render, setRender, editOne, setEditOne } = useBoards()
  const { removeBox, setRemoveBox, editModal, setEditModal } = useToggles()
  const [toggleMenu, setToggleMenu] = useState(false)
  const [psPosts, setPsPosts] = useState('')

  const allPsPostsShow = async () => {
    // currentPage是?page=哪一頁
    const currentPage = location.search
    try {
      const r = await fetch(`${SN_PSPOSTS}${currentPage}`)
      const data = await r.json()
      setPsPosts(data)
      // console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  const handlePsPage = async (p) => {
    try {
      const r = await fetch(`${SN_PSPOSTS}?page=${p}`)
      const data = await r.json()
      setPsPosts(data)
      // console.log(psPosts)
    } catch (err) {
      console.log(err)
    }
  }

  // const handlePush = (postId) => {
  //   // router.push(`/community/main-post?postId=${postId}`);
  //   handlePostId(postId)
  // }

  const removePost = async (postId) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      icon: 'warning',
      title: '確認刪除貼文?',
      showCancelButton: true,
      showCancelButton: true,
      confirmButtonColor: '#292929',
      cancelButtonColor: '#8B0000',
      confirmButtonText: '是',
      cancelButtonText: '否',
      timer: 3000,
    }).then((rst) => {
      if (rst.isConfirmed) {
        MySwal.fire({
          title: '刪除成功',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        })

        fetch(`${SN_DELETE_POST}/${postId}`, {
          method: 'DELETE',
          body: JSON.stringify(postId),
        })
          .then((r) => r.json())
          .then((result) => {
            // console.log(result)
            if (result.success) {
              // router.reload();
              // router.push(location.search);
              setRender(true)
            } else {
              toast.error('刪除失敗')
            }
          })
      }
    })
  }
  useEffect(() => {
    if (router.isReady) {
      const currentPage = router.query.page
      handlePsPage(currentPage)
    }
  }, [router.query.page, router.isReady])

  useEffect(() => {
    // 首次渲染及調用render都會執行
    allPsPostsShow()
    setRender(false)
  }, [render])
  // console.log(psPosts.totalPostsRows)

  return (
    <>
      {psPosts && psPosts.totalPages && (
        <ul className="bg-neutral-300 flex justify-center text-xl py-2">
          <span
            className="border-s-2 px-3 py-3 flex items-center hover:hover1"
            onClick={() => {
              router.push(
                {
                  pathname: '/community/main-personal',
                  query: { page: `${1}` },
                },
                undefined,
                { shallow: true }
              )
            }}
          >
            <RiArrowLeftDoubleLine />
          </span>
          {psPosts &&
            Array(10)
              .fill(1)
              .map((v, i) => {
                const p = psPosts.page - 5 + i
                // const p = i;
                if (p < 1 || p > psPosts.totalPages) return null
                return (
                  <li key={p}>
                    <span
                      // href={`?page=${p}`}
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/community/main-personal',
                            query: { page: `${p}` },
                          },
                          undefined,
                          { shallow: true }
                        )
                      }}
                      className={`border-s-2 px-5 flex py-3 hover:hover1 cursor-pointer
                     active:bg-white ${p === psPosts.page ? 'bg-white' : ''} `}
                      // onClick={() => handlePsPage(router.query.page)} 已在useEffect依賴
                    >
                      {p}
                    </span>
                  </li>
                )
              })}
          <span
            className="border-x-2 px-3 py-3 flex items-center hover:hover1"
            onClick={() => {
              router.push(
                {
                  pathname: '/community/main-personal',
                  query: { page: `${psPosts.totalPages}` },
                },
                undefined,
                { shallow: true }
              )
            }}
          >
            <RiArrowRightDoubleLine />
          </span>
        </ul>
      )}
      {psPosts.totalPostsRows &&
        psPosts.totalPostsRows.map((v, i) => {
          return (
            <main
              className="flex bg-neutral-300 border-b-2 border-b-slate-500 relative"
              key={v.post_id}
            >
              {/*relative用於toggle垃圾桶*/}
              <div
                // onClick={() => handlePush(v.post_id)} // href={`/community/main-post`}
                className=" pc:px-20 px-10 py-3 flex pc:hover:hover3 transition-transform w-full"
              >
                <div className="px-2 flex text-center absolute left-0">
                  {removeBox ? (
                    <label className="flex-col">
                      <input type="checkbox" />
                      <RiDeleteBinLine />
                    </label>
                  ) : (
                    ''
                  )}
                </div>
                <div className="w-[70%]">
                  {/* 改span或div用router push改 */}
                  <span
                    name="postId"
                    onClick={() => {
                      const href = {
                        pathname: `/community/main-post`,
                        query: { postId: `${v.post_id}` },
                      }
                      // handlePush(v.post_id)
                      router.push(href)
                    }}
                    className="cursor-pointer"
                  >
                    <div className="text-[20px] font-semibold flex items-center justify-between">
                      <span>{v.title}</span>
                      <span className="hidden pc:flex text-[12px]">
                        {dayjs(v.posts_timestamp).format('MMM DD, YYYY')}
                      </span>
                    </div>
                    <div className="text-[14px]">RYUSENKEI@ccmail.com</div>
                    <span>{v.content}</span>
                    <div className="text-[12px] pc:hidden">
                      {dayjs(v.posts_timestamp).format('MMM DD, YYYY')}
                    </div>
                  </span>
                  <div className="text-[14px] text-292929">
                    <div className="flex gap-2">
                      <span className="text-575757 flex w-[55px]">
                        <RiEyeFill className="pr-1" />
                        {v.view_count}
                      </span>
                      <span className="text-575757 flex w-[55px]">
                        <RiChat4Fill className="pr-1" />
                        {v.comment_count}
                      </span>
                      <span className="text-575757 flex w-[55px]">
                        <RiHeartFill className="pr-1" />
                        {v.likes}
                      </span>
                      <div className="relative">
                        <div
                          className="dropdown dropdown-right dropdown-end"
                          onClick={() => setToggleMenu(!toggleMenu)}
                        >
                          <div tabIndex={0} role="button">
                            <RiMoreFill className="pr-1 cursor-pointer" />
                          </div>
                          {toggleMenu && (
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-lg w-24"
                            >
                              <li onClick={() => removePost(v.post_id)}>
                                <a>remove</a>
                              </li>
                              <li>
                                <Link
                                  href={`/community/edit/${v.post_id}`}
                                  onClick={() => setEditModal(true)}
                                >
                                  edit
                                </Link>
                              </li>
                            </ul>
                          )}
                        </div>
                        {/* {toggleMenu && (
                          <ul
                            tabIndex={0}
                            className="bg-white absolute bottom-0 left-[30px] rounded-lg"
                          >
                            <li
                              onClick={() => removePost(v.post_id)}
                              className="cursor-pointer p-2 hover:bg-slate-300"
                            >
                              <a>remove</a>
                            </li>
                            <li className="cursor-pointer p-2 hover:bg-slate-300">
                              <a>edit</a>
                            </li>
                          </ul>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  className="ml-6 w-[100px] pc:w-[150px] flex items-center justify-end flex-shrink-0 cursor-pointer"
                  // onClick={() => handlePush(v.post_id)}
                  href={`/community/main-post?postId=${v.post_id}`}
                >
                  {v.image_url && (
                    <Image
                      className="size-[100px] object-cover rounded-xl"
                      src={`${API_SERVER}/${v.image_url}`}
                      width={100}
                      height={100}
                      alt="上傳的無法顯示圖片"
                    />
                  )}
                </Link>
              </div>
            </main>
          )
        })}
    </>
  )
}
