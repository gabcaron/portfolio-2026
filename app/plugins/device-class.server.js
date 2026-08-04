// app/plugins/device-class.server.js
import { UAParser } from 'ua-parser-js'

export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const ua = event?.node?.req?.headers?.['user-agent'] || ''
  const parser = new UAParser(ua)
  const device = parser.getDevice()

  let deviceClass = 'desktop'
  if (device.type === 'mobile') deviceClass = 'phone'
  else if (device.type === 'tablet') deviceClass = 'tablet'

  useHead({
    htmlAttrs: { class: deviceClass }
  })
})