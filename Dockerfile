# Build the static files and copy them to the nginx server
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Build the backend server
FROM python:3.9.13-slim-buster
WORKDIR /app
COPY --from=build /app/build ./build

# Install the required packages
RUN mkdir ./backend
COPY ./backend ./backend
RUN pip install -r ./backend/requirements.txt
ENV FLASK_APP=production

EXPOSE 80
WORKDIR /app/backend
CMD ["gunicorn", "-w", "4", "-b", ":80", "--timeout", "120", "app:app"]
