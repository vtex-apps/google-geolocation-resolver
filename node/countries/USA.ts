const rules: Rules = {
  geolocation: {
    postalCode: {
      valueIn: 'long_name',
      types: ['postal_code'],
      required: false,
    },
    street: {
      valueIn: 'long_name',
      types: ['route'],
    },
    neighborhood: {
      valueIn: 'long_name',
      types: [
        'neighborhood',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
        'sublocality_level_5',
      ],
    },
    state: {
      valueIn: 'short_name',
      types: ['administrative_area_level_1'],
    },
    city: {
      valueIn: 'long_name',
      types: ['locality'],
    },
  },
}

export default rules
