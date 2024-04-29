import { Column } from 'src/components/Flex'
import { ThemedText } from 'src/theme/components'
import { styled } from 'styled-components'

const ComingSoon = styled(Column)`
  width: 500px;
  margin: 0 auto;
  justify-content: center;
  gap: 16px;
  height: 80vh;
`

export default function HomePage() {
  return (
    <ComingSoon>
      <ThemedText.HeadlineLarge fontSize={48}>Joyboy</ThemedText.HeadlineLarge>
      <ThemedText.SubHeader fontSize={36}>Starknet x Nostr</ThemedText.SubHeader>
      <ThemedText.SubHeaderSmall fontSize={24}>Coming soon</ThemedText.SubHeaderSmall>
    </ComingSoon>
  )
}
