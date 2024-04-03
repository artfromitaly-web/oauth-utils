type AuthCodeArgs = {
  clientId: string
  redirectUri: string
  state?: string
  customParams?: Partial<Record<string, string | null>>
  scopes?: string[]
}

export function getAuthCodeUrl(
  endpoint: string,
  { clientId, redirectUri, state, customParams, scopes }: AuthCodeArgs
) {
  const url = new URL(endpoint)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', redirectUri)
  if (state) {
    url.searchParams.set('state', state)
  }
  if (scopes?.length) {
    url.searchParams.set('scope', scopes.join(' '))
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
