import os from 'node:os'

export default function GetHostIP() {
  const interfaces = os.networkInterfaces()
  for(const interfaceList of Object.values(interfaces)){
    for (const item of interfaceList || []) {
      if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
        return item.address
      }
    }
  }
  return ""
}
