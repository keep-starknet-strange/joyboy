# Contributor Guidelines

- Claiming a task

  - Comment on the task you would like to take, include the estimated delivery timeline (start date and estimated completion date), describe how you would approach this task and a include brief summary of relevant skills.
  - Join the Telegram group for updates and discussions. https://t.me/JoyboyStarknet

- Task Assignment

  - Easy/Medium tasks will be assigned on a first-come, first-served basis. No further assignment required.
  - Complex tasks will be assigned based on the proposals submitted by the prospective assignees to ensure optimal match and prioritization.
  - You should create your first commit within 48 hours of being assigned to a task. If no commits are made or you are unreachable, we reserve the right to reassign the task.

- Submission Guidelines
  - Submit a pull request from your forked repository.
  - Ensure to rebase on the current master branch before creating the PR.
  - If there are any, fix the conflicts before submitting the PR.
  - Clearly describe the changes you made in the PR description.
  - Include screenshots if necessary.

## Contributing to the Mobile App

### Setup

- Clone the repository
- Navigate to the JoyboyCommunity directory. `cd JoyboyCommunity`
- Install the dependencies using yarn `yarn install`
- Start the development server `yarn start`
- Open the app in your browser / device / emulator.

### Development

- Create a new branch for your feature `git checkout -b feat/your-feature`
- Make your changes
- Create a pull request and follow the Submission Guidelines above.

### Requirements

- The app must run without errors.
- The app must be responsive and work on all devices.
- The app must use the already defined styles and components if possible.
- Styling should be made using StyleSheet or ThemedStyleSheet.
- Theming should be used for all colors. Spacings should use the Spacing object.
- Texts should be made using the Text component so that they can use the correct font and be themed.
- Icons should be added to assets/icons.tsx and used from there. If the icon has a single color, it should use currentColor, and usage should define the color.
