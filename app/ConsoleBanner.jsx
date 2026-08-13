'use client'
import { useEffect } from 'react'

export default function ConsoleBanner() {
  useEffect(() => {
    console.log(
`%c
██╗     ██╗   ██╗██╗  ██╗  ████╗███████╗ ██████╗ ███╗   ██╗
██║     ██║   ██║╚██╗██╔╝    ██║██╔════╝██╔═══██╗████╗  ██║
██║     ██║   ██║ ╚███╔╝     ██║███████╗██║   ██║██╔██╗ ██║
██║     ██║   ██║ ██╔██╗ ██╗ ██║╚════██║██║   ██║██║╚██╗██║
███████╗╚██████╔╝██╔╝ ██╗██████║███████║╚██████╔╝██║ ╚████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
%c
Junior Web Developer

`,
'color: #00d4ff; font-weight: bold; font-size: 14px;',
'color: #a5abad; font-size: 13px;'
    );

  }, [])

  return null
}
