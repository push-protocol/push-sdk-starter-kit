# EPNS-SDK starter kit

This starter-kit is meant to showcase developers on how to use the EPNS SDK packages - 

* [@epnsproject/sdk-restapi](https://www.npmjs.com/package/@epnsproject/sdk-restapi) Provides access to EPNS backend APIs.
* [@epnsproject/sdk-uiweb](https://www.npmjs.com/package/@epnsproject/sdk-uiweb) Provides React based components to show Notifications, Spam, SubscribedModal etc for dApps.
* [@epnsproject/sdk-uiembed](https://www.npmjs.com/package/@epnsproject/sdk-uiembed) Provides vanilla JS sidebar notifications for any  dApp.

### CRA-Typescript
This particular kit is built out using CRA, Typescript. The SDK packages should also work out for React using plain JS.

## Getting started
```bash
git clone https://github.com/ethereum-push-notification-service/epns-sdk-starter-kit.git
```

```bash
cd epns-sdk-starter-kit
```

```bash
yarn install
```
```bash
yarn start
```

## Dependencies
If your are trying to build out a separate dApp following this starter-kit example, some of the following dependencies are needed for the SDK and any dApp to work.

1. `@epnsproject/sdk-uiweb` has a `peerDependency` on `styled-components`

```bash
yarn add styled-components
```

2. Since its a dApp, the following are the **web3** dependencies that you can install for wallet connection
```bash
 yarn add ethers
```

3. Needed only if you are using [web3-react](https://github.com/Uniswap/web3-react). You are free to use any other React based web3 solution.
```bash
yarn add @web3-react/core @web3-react/injected-connector
```

**But no need to install these if you are using the `starter-kit` itself since we have already installed these for you so that you can focus on how to use the EPNS-SDK packages**

## App walkthrough

The App has following features-

| Page    | Features    | SDK package used |
|----------|---------|---------|
| Notifications    | notifications, <br/>spams, <br/>subscribed modal  |  @epnsproject/sdk-uiweb, <br/>@epnsproject/sdk-restapi    |
| Channels     | search a channel, <br/>get channel subscribers, <br/>is the logged-in user subscribed to the channel, <br/>opt in a channel, <br/>opt out a channel  | @epnsproject/sdk-restapi      |
| Embed | sidebar notifications for the logged in user if subscribed on EPNS  |   @epnsproject/sdk-uiembed    |

**We have extracted some snippets from the actual source code of the `starter-kit` files mentioned below to give you a snapshot view of what all SDK features are used in this dApp. But to make sure you are following along correctly please refer to the source code itself in the files mentioned.**

**Also the detailed SDK docs are hyperlinked in the feature's header itself**


*If you have got the wallet connection logic down, you can start referring from section [3](#3-features-usage) onwards.*

### 1. Connecting to the Wallet
Any dApp will require a wallet connection logic before it is usable. We have handled that for you in `App.tsx`. If you want to tinker around  with that, check the below component.

```typescript
import ConnectButton from './components/connect';
```

### 2. Wallet connection Props to be used throughout the dApp
We basically derive the account, signer and some other wallet connection properties to use throughout the dApp with the SDK.

```typescript
const { chainId, account, active, error, library  } = useWeb3React();
```
We store this data in the web3Context and make it available across the dApp for later use.

### 3. Features usage


NOTIFICATIONS PAGE (`src/pages/notifications/index.tsx`)
```typescript
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import { NotificationItem, chainNameType, SubscribedModal } from '@epnsproject/sdk-uiweb';
```

#### [Fetching Notifications](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#fetching-notifications)

```typescript
const response = await EpnsAPI.fetchNotifications({
  user: account,
  chainId
});

const parsedResults = EpnsAPI.parseApiResponse(response.results);
```
#### [Displaying Notifications]()

```typescript
// notifs === parsedResults
{notifs.map((oneNotification, i) => {
    const { 
    cta,
    title,
    message,
    app,
    icon,
    image,
    url,
    blockchain,
    secret,
    notification
    } = oneNotification;

    return (
        <NotificationItem
            key={`notif-${i}`}
            notificationTitle={secret ? notification['title'] : title}
            notificationBody={secret ? notification['body'] : message}
            cta={cta}
            app={app}
            icon={icon}
            image={image}
            url={url}
            theme={theme}
            chainName={blockchain as chainNameType}
        />
    );
})}
```

#### [Fetching Spams](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#fetching-spam-notifications)

```typescript
const response = await EpnsAPI.fetchSpamNotifications({
    user: account,
    chainId
});

const parsedResults = EpnsAPI.parseApiResponse(response.results);
```

```typescript
// spams === parsedResults
{spams ? (
    <NotificationListContainer>
        {spams.map((oneNotification, i) => {
        const { 
        cta,
        title,
        message,
        app,
        icon,
        image,
        url,
        blockchain,
        secret,
        notification
        } = oneNotification;

        return (
            <NotificationItem
                key={`spam-${i}`}
                notificationTitle={secret ? notification['title'] : title}
                notificationBody={secret ? notification['body'] : message}
                cta={cta}
                app={app}
                icon={icon}
                image={image}
                url={url}
                theme={theme}
                chainName={blockchain as chainNameType}
                // optional parameters for rendering spambox
                isSpam
                subscribeFn={async () => console.log("yayy spam")}
                isSubscribedFn={async () => false}
    
            />
        );
    })}
```

#### SubscribedModal

```typescript
    const [showSubscribe, setShowSubscribe] = useState(false);

    const toggleSubscribedModal = () => {
        setShowSubscribe((lastVal) => !lastVal);
    };


    // JSX
    {showSubscribe ? <SubscribedModal onClose={toggleSubscribedModal}/> : null}
```

CHANNELS PAGE (`src/pages/channels/index.tsx`)

```typescript
import * as EpnsAPI from '@epnsproject/sdk-restapi';
```
#### [Fetch Channel Data](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#fetching-channel-details)

```typescript
const response = await EpnsAPI.getChannelByAddress({
    channel: channelAddr,
    chainId
});
```

*Note on `channelAlias`: If you are running the dApp on any network other than ETH_Mainnet, ETH_Kovan like Polygon, then you need to provide a `channelAlias` if that channel has a registered alias address on the same network (i.e. Polygon etc). The response from `getChannelByAddress` has a field called `alias_address` which has the value for the `channelAlias` if registered.*

#### [Fetch Channel Subscribers](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#fetching-channels-subscribers-details)

```typescript
const response = await EpnsAPI.getSubscribers({
    channel: channelAddr,
    channelAlias: [80001, 37].includes(chainId) ? (channelData && channelData['alias_address']) : channelAddr,
    chainId
});
```

#### [Fetch Subscriber Status](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#check-if-user-is-subscribed-to-a-channel)

```typescript
const response = await EpnsAPI.isUserSubscribed({
    channel: channelAddr,
    channelAlias: [80001, 37].includes(chainId) ? (channelData && channelData['alias_address']) : channelAddr,
    user: account,
    chainId
});
```

#### [Opt-In to a channel](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#opt-in-to-a-channel) 

```typescript
 const _signer = library.getSigner(account); // from useWeb3()
 //
 //
 //
await EpnsAPI.optIn({
    signer: _signer,
    channelAddress: channelAddr,
    channelAlias: [80001, 37].includes(chainId) ? (channelData && channelData['alias_address']) : channelAddr,
    userAddress: account,
    chainId,
    onSuccess: () => {
    console.log('opt in success');
        setSubscriberStatus(true);
    },
    onError: (e) => {
        console.error('opt in error', e);
    },
})
```

#### [Opt-Out of a channel](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/restapi/README.md#opt-out-to-a-channel) 

```typescript
 const _signer = library.getSigner(account); // from useWeb3()
 //
 //
 //
  await EpnsAPI.optOut({
    signer: _signer,
    channelAddress: channelAddr,
    channelAlias: [80001, 37].includes(chainId) ? (channelData && channelData['alias_address']) : channelAddr,
    userAddress: account,
    chainId,
    onSuccess: () => {
    console.log('opt out success');
        setSubscriberStatus(false);
    },
    onError: (e) => {
        console.error('opt out error', e);
    },
})
```


EMBED PAGE (`src/pages/embed/index.tsx`)
#### [Embed - Sidebaar notifications](https://github.com/ethereum-push-notification-service/epns-sdk/blob/main/packages/uiembed/README.md#uiembed) 


```typescript
import { useEffect, useContext } from 'react';
import { EmbedSDK } from "@epnsproject/sdk-uiembed";
import Web3Context from '../../context/web3Context';

const EmbedPage = () => {
    const { account, chainId } = useContext<any>(Web3Context);

    useEffect(() => {
        if (account) { // 'your connected wallet address'
          EmbedSDK.init({
            chainId,
            headerText: 'Hello Hacker Dashboard', // optional
            targetID: 'sdk-trigger-id', // mandatory
            appName: 'hackerApp', // mandatory
            user: account, // mandatory
            viewOptions: {
                type: 'sidebar', // optional [default: 'sidebar', 'modal']
                showUnreadIndicator: true, // optional
                unreadIndicatorColor: '#cc1919',
                unreadIndicatorPosition: 'top-right',
            },
            theme: 'light',
            onOpen: () => {
              console.log('-> client dApp onOpen callback');
            },
            onClose: () => {
              console.log('-> client dApp onClose callback');
            }
          });
        }
    
        return () => {
          EmbedSDK.cleanup();
        };
      }, [account, chainId]);


    return (
        <div>
          <h2>Embed Test page</h2>


          <button id="sdk-trigger-id">trigger button</button>
        </div>
    );
}
```