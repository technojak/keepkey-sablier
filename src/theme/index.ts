import { extendTheme, ThemeConfig, withDefaultColorScheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';

const colors = {
  primary: {
    50: '#dafffa',
    100: '#affbed',
    200: '#83f8e1',
    300: '#54f3d5',
    400: '#28f0ca',
    500: '#0fd7b0',
    600: '#00a789',
    700: '#007762',
    800: '#00493a',
    900: '#001a14',
  },
  secondary: {
    50: '#f0ecff',
    100: '#cfc8ee',
    200: '#aea4dc',
    300: '#8e80cc',
    400: '#6e5cbd',
    500: '#5442a3',
    600: '#423480',
    700: '#2f255d',
    800: '#1b1539',
    900: '#0a0619',
  },
  bg: {
    main: '#EBE9E9'
  }
}

const styles = {
  global: (props: any) => ({
    body: {
      color: mode('blackAlpha.900', 'whiteAlpha.900')(props),
      bg: mode('#EBE9E9', 'rgb(30, 30, 36)')(props),
    },
  })
}

const breakpoints = ["360px", "768px", "1024px", "1440px"];

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const shadows = {
  outline: "green.500"
}

export const theme = extendTheme({
  breakpoints,
  config,
  colors,
  styles,
  shadows,
}, withDefaultColorScheme({ colorScheme: "primary" }))
