# renzo-balance-script

### Repository Setup

#### Environment 

Create a `./.env` file with Sentio API key
```
SENTIO_API_KEY=...
```

#### Dependencies

```
yarn install
```


### Execution/Testing

The execution can be found in `./src/main.ts` where configuration required is simply Sentio api endpoint and blocknumber. Full user list can be fetched from the Sentio respository itself.

Execution command:
```
yarn ts-node src/main.ts 
```

