// composables/watchOnlineStatus.ts
import { onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useWatchOnlineStatus = () => {
  const router = useRouter()

  onMounted(() => {
    const interval = setInterval(async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (storedUser) {
        try {
          const res = await axios.get(`http://localhost:3001/roles/${storedUser.id}`)
          if (!res.data?.online) {
            localStorage.removeItem('user')
            alert('คุณถูก Admin ออกจากระบบ')
            clearInterval(interval)
            router.push('/Login')
          }
        } catch (err) {
          console.error('Check online status error:', err)
        }
      } else {
        clearInterval(interval)
      }
    }, 5000)
  })
}
