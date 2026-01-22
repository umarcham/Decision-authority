# Use the official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8080

# Run the application using Gunicorn (Production Server)
# Bind to 0.0.0.0:$PORT
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
