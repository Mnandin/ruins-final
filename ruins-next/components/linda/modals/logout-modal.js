import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'

export default function LogoutModal({ isVisible }) {
  const { logout, auth } = useAuth()
  if (!isVisible) return null
  return (
    <>
      {/* mobile pop up logout */}
      <div className="md:hidden w-full absolute top-[47px] left-0 bg-black flex-col items-center">
        <div className="flex flex-col py-[20px] gap-[10px] items-center justify-center">
          <Image
            width={50}
            className="rounded-full"
            height={50}
            src="https://lh3.googleusercontent.com/a/ACg8ocI4VUmpEMt9lXmuUU6IGPtHQ6DfAX7DthWshGUN4Hi7vVqq7A=s96-c"
            alt=""
          />
          <div>{auth.username}</div>
        </div>
        <div className="flex-col text-xs items-center flex">
          <div className="text-neutral-300 px-[19px] py-3 border-b border-white flex-col justify-start items-center flex">
            ACCOUNT
          </div>
        </div>
        <div className="text-white py-[15px] flex-col justify-start items-center gap-1.5 flex">
          <Link href="/member/account-settings/account" className="text-base">
            PROFILE
          </Link>
          <Link
            href="#"
            onClick={() => {
              e.preventDefault()
              logout()
            }}
            className="text-base"
          >
            SETTINGS
          </Link>
          <Link href="#" onClick={logout} className="text-rose-400 text-base">
            LOGOUT
          </Link>
        </div>
      </div>
    </>
  )
}
