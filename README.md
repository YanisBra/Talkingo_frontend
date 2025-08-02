Install dependencies and build the app for production
```
npm install
npm run dev
```

Run tests 
```
npm run test
```

Build the image and run as container
```
docker build -t talkingo_frontend .
docker run --name talkingo_frontend_container -p 5173:5173 talkingo_frontend
```