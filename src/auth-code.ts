type AuthCodeArgs = {
  clientId: string
  redirectUri: string
  state?: string
  customParams?: Record<string, string>
}

export function getAuthCodeUrl(
  endpoint: string,
  { clientId, redirectUri, state, customParams }: AuthCodeArgs
) {
  const url = new URL(endpoint)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', redirectUri)
  if (state) {
    url.searchParams.set('state', state)
  }
  if (customParams) {
    Object.entries(customParams).forEach(([k, v]) => {
      if (v) {
        url.searchParams.set(k, v)
      }
    })
  }
  return url.toString()
}
