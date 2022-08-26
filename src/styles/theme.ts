import {
    extendTheme,
    theme as base,
    withDefaultColorScheme,
    withDefaultVariant,
} from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const inputSelectStyles = {
    variants: {
        filled: {
            fields: {
                _focus: {
                    borderColor: 'brand.500',
                },
            },
        },
    },
}

const brandRings = {
    _focus: {
        ring: 2,
        ringColor: 'brand.500',
    },
}

export const theme = extendTheme(
    {
        colors: {
            brand: {
                '900': '#181B23',
                '800': '#1F2029',
                '700': '#353646',
                '600': '#4B4D63',
                '500': '#616480',
                '400': '#797D9A',
                '300': '#9699B0',
                '200': '#B3B5C6',
                '100': '#D1D2DC',
                '50': '#EEEEF2',
            },
        },
        fonts: {
            heading: `Roboto, ${base.fonts.heading}`,
            body: `Roboto, ${base.fonts.body}`,
        },
        components: {
            Button: {
                variants: {
                    primary: (props) => ({
                        ...brandRings,
                        color: mode('white', 'gray.900')(props),
                        backgroundColor: mode('blue.500', 'blue.200')(props),

                        _hover: {
                            backgroundColor: mode(
                                'blue.600',
                                'blue.300'
                            )(props),
                        },

                        _active: {
                            backgroundColor: mode(
                                'brand.700',
                                'brand.400'
                            )(props),
                        },
                    }),
                },
            },
            Input: { ...inputSelectStyles },
            Select: { ...inputSelectStyles },
            Checkbox: {
                baseStyle: {
                    control: {
                        ...brandRings,
                    },
                },
            },
        },
    },
    withDefaultColorScheme({
        colorScheme: 'brand',
        components: ['Checkbox', 'Button'],
    }),
    withDefaultVariant({
        variant: 'filled',
        components: ['Input', 'Select'],
    })
)
