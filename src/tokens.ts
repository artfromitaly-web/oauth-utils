import { HeadersBuilder, type AuthScheme } from '@artfromitaly/fetch-utils/headers'

type TokensArgs = {
  clientId: string
  clientSecret: string
  authCode: string
  redirectUri: string
}

export type Tokens = {
  token_type: AuthScheme
  access_token: string
  refresh_token?: string
}

async function mapTokensResponse(tokensResponse: Response) {
  return (await tokensResponse.json()) as Tokens
}
type MapTokensResponse = typeof mapTokensResponse

export async function getTokens(
  endpoint: string,
  { clientId, clientSecret, authCode, redirectUri }: TokensArgs,
  mapResponse: MapTokensResponse = mapTokensResponse
) {
  return await _fetchTokens(
    endpoint,
    {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri
    },
    mapResponse
  )
}

type RefreshTokensArgs = {
  clientId: string
  clientSecret: string
  refreshToken: string
}
export async function refreshTokens(
  endpoint: string,
  { clientId, clientSecret, refreshToken }: RefreshTokensArgs,
  mapResponse: MapTokensResponse = mapTokensResponse
) {
  return await _fetchTokens(
    endpoint,
    {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    mapResponse
  )
}

type ClientCredentialsArgs = {
  clientId: string
  clientSecret: string
}
export async function clientCredentials(
  endpoint: string,
  { clientId, clientSecret }: ClientCredentialsArgs,
  mapResponse: MapTokensResponse = mapTokensResponse
) {
  return (await _fetchTokens(
    endpoint,
    {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    },
    mapResponse
  )) as Omit<Tokens, 'refresh_token'>
}

type FetchTokensArgs = {
  client_id: string
  client_secret: string
} & (
  | {
      grant_type: 'authorization_code'
      code: string
      redirect_uri: string
    }
  | {
      grant_type: 'refresh_token'
      refresh_token: string
    }
  | {
      grant_type: 'client_credentials'
    }
)

async function _fetchTokens(
  endpoint: string,
  args: FetchTokensArgs,
  mapResponse: MapTokensResponse = mapTokensResponse
) {
  const headers = new HeadersBuilder()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .build()

  const body = new URLSearchParams()
  Object.entries(args).forEach(([k, v]) => {
    body.append(k, v)
  })

  const tokensResponse = await fetch(endpoint, {
    headers,
    method: 'POST',
    body
  })
  return await mapResponse(tokensResponse)
}
