import getAddressSuggestions from '../resolvers/addressSuggestions'
// eslint-disable-next-line jest/no-mocks-import
import {
  mockContext,
  defaultWarn,
  defaultPlaceAutocomplete,
} from '../__mocks__/context.mock'

describe('addressSuggestion', () => {
  it.each(['pt-BR', 'en'])(
    'shouldn\'t log "%s" as invalid language code',
    async (language: string) => {
      const mockedWarn = jest.fn((_warning: unknown) => undefined)

      await getAddressSuggestions(
        {},
        { searchTerm: '' },
        mockContext({ locale: language, mockedWarn })
      )

      expect(mockedWarn).not.toBeCalledWith(
        `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
      )
    }
  )

  it.each(['pt_BR', ''])(
    'should log "%s" as invalid language code',
    async (language: string) => {
      const mockedWarn = jest.fn((_warning: unknown) => undefined)

      await getAddressSuggestions(
        {},
        { searchTerm: '' },
        mockContext({ locale: language, mockedWarn })
      )

      expect(mockedWarn).toBeCalledWith(
        `"${language}" is not a valid language. See the list of supported languages on https://developers.google.com/maps/faq#languagesupport`
      )
    }
  )

  it.each(['br', 'bra', 'BR', 'BRA'])(
    'should restrict address suggestions to Brazil when the "%s" country code is given',
    async (country: string) => {
      const mockedWarn = jest.fn(defaultWarn)
      const mockedPlaceAutocomplete = jest.fn(defaultPlaceAutocomplete)

      await getAddressSuggestions(
        {},
        { searchTerm: '', country },
        mockContext({ mockedPlaceAutocomplete, mockedWarn })
      )

      expect(mockedPlaceAutocomplete.mock.calls[0][0]).toMatchObject({
        params: { components: ['country:br'] },
      })
      expect(mockedWarn).not.toBeCalledWith(
        `"${country}" is not a valid country code. Use a two character, case insensitive, ISO 3166-1 Alpha-2 or Alpha-3 compatible country code instead.`
      )
    }
  )

  it('should not restrict address suggestions when no country code is given', async () => {
    const mockedWarn = jest.fn(defaultWarn)
    const mockedPlaceAutocomplete = jest.fn(defaultPlaceAutocomplete)

    await getAddressSuggestions(
      {},
      { searchTerm: '' },
      mockContext({ mockedPlaceAutocomplete, mockedWarn })
    )

    expect(mockedPlaceAutocomplete.mock.calls[0][0]).toMatchObject({
      params: { components: undefined },
    })
    expect(mockedWarn).not.toBeCalledWith(
      '"" is not a valid country code. Use a two character, case insensitive, ISO 3166-1 Alpha-2 or Alpha-3 compatible country code instead.'
    )
  })

  it('should not restrict address suggestions when an invalid country code is given', async () => {
    const mockedWarn = jest.fn(defaultWarn)
    const mockedPlaceAutocomplete = jest.fn(defaultPlaceAutocomplete)

    await getAddressSuggestions(
      {},
      { searchTerm: '', country: 'Brazil' },
      mockContext({ mockedPlaceAutocomplete, mockedWarn })
    )

    expect(mockedPlaceAutocomplete.mock.calls[0][0]).toMatchObject({
      params: { components: undefined },
    })
    expect(mockedWarn).toBeCalledWith(
      '"Brazil" is not a valid country code. Use a two character, case insensitive, ISO 3166-1 Alpha-2 or Alpha-3 compatible country code instead.'
    )
  })
})
