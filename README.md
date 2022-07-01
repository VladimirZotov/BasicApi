# Basic Asp.Net Core + ReactJS webapp
## Run API
```
cd .
docker build -t basicapi . -f .\BasicApi\Dockerfile
docker run -p 4000:80 basicapi
```
## Run ReactJS
```
cd BasicWeb
npm i 
npm run dev
```