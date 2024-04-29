import { createRoot } from 'react-dom/client'
import ThemeProvider, { ThemedGlobalStyle } from 'src/theme'

import App from './App'

const container = document.getElementById('root')
if (!container) throw 'Undefined #root container'

const root = createRoot(container)
root.render(
  <ThemeProvider>
    <ThemedGlobalStyle />
    <App />
  </ThemeProvider>
)
