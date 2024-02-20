// not used

'use client'

import { Button, Card } from 'flowbite-react';
import { useCookies } from 'next-client-cookies';
import { Avatar } from 'flowbite-react';
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
        
    const cookiesStore = useCookies()
    const router = useRouter()
    let publicKey = cookiesStore.get('publicAddress')

    function handleLogout() {
      cookiesStore.remove('publicAddress')
      router.push('/')
      router.refresh()
    }
    
    function CardFunction() {

        return (
          <Card className="w-max text-sm">
            <Avatar rounded size="lg" />
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {publicKey}
            </p>
            <Button className="m-auto w-max bg-[#12d7a9] enabled:hover:bg-[#14b780]" onClick={handleLogout}>logout</Button>
          </Card>
        );
      }
    
    
    return (
        <main className="">
            <div className="flex my-32">
                <div className="m-auto">
                    <CardFunction />
                </div>
                <div className="m-auto pl-5 lg:pl-0">
                    <p className="text-black collapse md:visible">You're logging out from this account</p>
                </div>
            </div>
        </main>
    )
}