import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';

// import { getCAIPAddress } from '../helpers';

export type SDKSocketHookOptions = {
  account?: string | null,
  env?: string,
  chainId?: number,
  isCAIP?: boolean
};

export const useSDKSocket = ({ account, env = '', chainId, isCAIP }: SDKSocketHookOptions) => {
  
  const [pushSDKSocket, setPushSDKSocket] = useState<any>(null);
  const [feedsSinceLastConnection, setFeedsSinceLastConnection] = useState<any>([]);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(pushSDKSocket?.connected);
  const [lastConnectionTimestamp, setLastConnectionTimestamp] = useState('');

  const addSocketEvents = () => {
    // console.warn('\n--> addSocketEvents');
    pushSDKSocket?.on(EVENTS.CONNECT, () => {
      // console.log('CONNECTED: ');
      setIsSDKSocketConnected(true);
      setLastConnectionTimestamp((new Date()).toUTCString());
    });

    pushSDKSocket?.on(EVENTS.DISCONNECT, () => {
      // console.log('DIS-CONNECTED: ');
      setIsSDKSocketConnected(false);
      setFeedsSinceLastConnection([]);
      setLastConnectionTimestamp('');
    });

    // console.log('\t-->will attach eachFeed event now');
    pushSDKSocket?.on(EVENTS.USER_FEEDS, (feedList: any) => {
      /**
       * We receive a feed list which has 1 item.
       */
      console.log("\n\n\n\neachFeed event: ", feedList);

      // do stuff with data
      setFeedsSinceLastConnection((oldFeeds: any) => {
        return [...oldFeeds, ...feedList]
      });
    });
  };

  const removeSocketEvents = () => {
    // console.warn('\n--> removeSocketEvents');
    pushSDKSocket?.off(EVENTS.CONNECT);
    pushSDKSocket?.off(EVENTS.DISCONNECT);
    pushSDKSocket?.off(EVENTS.USER_FEEDS);
  };

  useEffect(() => {
    if (pushSDKSocket) {
      addSocketEvents();
    }
  
    return () => {
      if (pushSDKSocket) {
        removeSocketEvents();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushSDKSocket]);


  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection 
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (pushSDKSocket) {
        // console.log('=================>>> disconnection in the hook');
        pushSDKSocket?.disconnect();
      }
      
      const connectionObject = createSocketConnection({
        user: account,
        env,
        socketOptions: { autoConnect: false }
      });
      // console.warn('new connection object: ', connectionObject);
      // set to context
      setPushSDKSocket(connectionObject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, chainId, isCAIP]);


  return {
      pushSDKSocket,
      isSDKSocketConnected,
      feedsSinceLastConnection,
      lastConnectionTimestamp
  }
};