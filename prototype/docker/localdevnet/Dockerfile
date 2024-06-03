# Use the official Rust image
FROM rust:latest

# Set the working directory
WORKDIR /usr/src/devnet

# Clone the GitHub repository
RUN git clone https://github.com/0xSpaceShard/starknet-devnet-rs.git .

# Build the Rust application
RUN cargo build --release

# Command to run the Rust application
CMD ["./target/release/starknet-devnet-rs"]
