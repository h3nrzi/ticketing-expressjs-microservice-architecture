# Use the node:alpine image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --prod

# Copy the rest of the application
COPY ./ ./

CMD ["pnpm", "start"]
