import * as Linking from 'expo-linking'

export const redirectToWhatsapp = (phone: string) => {
  Linking.openURL(`whatsapp://send?phone=${phone}`)
}

export const callPhone = (phone: string) => {
  const phoneUrl = `tel://${phone.trim()}`
  Linking.openURL(phoneUrl)
}

export const redirectToEmail = (params: { email: string; subject?: string; body?: string }) => {
  const { email, subject, body } = params
  let query = ''
  if (subject) {
    query = `?subject=${subject}`
  }
  if (body) {
    query += `&body=${body}`
  }
  Linking.openURL(`mailto:${email}${query}`)
}

export const redirectToSMS = (params: { phone: string; body?: string }) => {
  const { phone, body } = params
  let query = ''
  if (body) {
    query = `?body=${body}`
  }
  const url = `sms:${phone}${query}`

  Linking.openURL(url)
}
