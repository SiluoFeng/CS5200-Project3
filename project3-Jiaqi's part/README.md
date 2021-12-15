# nodeExpressRedisEJS
I use Redis to do CRUD on the address data.
There is a loading file in the db folder that load the json addreess array into redis.  PS, the script may have some bugs depends on your system, but all the data can be loaded to redis successfully.



## Using it

1) Clone the repo
2) Install the dependencies

```
npm install
```

3) start the redis server
```
reids-server
```


4) run the loading file
```
node db/loading_to_redis_script.js
```

5) Start the server

```
npm start
```

4) Point your browser to http://locahost:3000


