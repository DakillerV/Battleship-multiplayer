## REACT HANGMAN++++

### How to run (Development)

1. Dowload latest project files at [Github](https://github.com/DakillerV/react-hangman.git)

2. Install it and run (Run in separate terminals)
Client:
```
cd Client
npm i
npm run dev
```
Server:
```
npm run dev
```
### How to build
``` 
docker build . -t=hang
```

### How to run (Production)
```
start new container with the image: hang:latest and with port 3000 exposed and env settings configured

expose with proxy (in my case nginx proxy manager)
```
