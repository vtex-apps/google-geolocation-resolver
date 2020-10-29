const rules: Rules = {
  geolocation: {
    postalCode: {
      valueIn: 'long_name',
      types: ['postal_code'],
      required: false,
    },
    number: {
      valueIn: 'long_name',
      types: ['street_number'],
      required: true,
      notApplicable: true,
    },
    street: { valueIn: 'long_name', types: ['route'] },
    state: {
      valueIn: 'short_name',
      types: ['administrative_area_level_1'],
    },
    city: {
      valueIn: 'long_name',
      types: ['locality', 'administrative_area_level_2'],
    },
    neighborhood: {
      valueIn: 'long_name',
      types: ['administrative_area_level_3'],
    },
  },
}

export default rules
