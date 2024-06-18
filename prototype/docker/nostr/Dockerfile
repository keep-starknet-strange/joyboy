# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/relay

# Clone the GitHub repository
RUN git clone https://github.com/CodyTseng/nostr-relay-nestjs.git .

# Install the dependencies
RUN npm install

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the NestJS application
CMD ["npm", "run", "start"]
