import React, { useEffect, useState, useContext } from 'react';
import { Section, SectionItem, CodeFormatter, SectionButton } from '../../components/styled';
import Loader from '../../components/loader';
import Web3Context, { DevContext } from '../../context/web3Context';
import * as EpnsAPI from '@epnsproject/sdk-restapi';

const ChannelsPage = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { isDevENV } = useContext<any>(DevContext);
  const [channelAddr, setChannelAddr] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState();
  const [channelListData, setChannelListData] = useState();
  const [subscriberData, setSubscriberData] = useState();
  const [subscriberStatus, setSubscriberStatus] = useState<boolean>();  

  const updateChannelAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    setChannelAddr(
      (e.target as HTMLInputElement).value
    );
  };

  const updateChannelName = (e: React.SyntheticEvent<HTMLElement>) => {
    setChannelName(
      (e.target as HTMLInputElement).value
    );
  };

  const testGetChannelByAddress = async () => {
    try {
      setLoading(true);

      // object for channel data
      const response = await EpnsAPI.channels.getChannel({
        channel: channelAddr,
        chainId,
        dev: isDevENV
      });
      
      setChannelData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testGetChannelByName = async () => {
    try {
      setLoading(true);

      // Array for channels data
      const response = await EpnsAPI.channels.search({
        query: channelName,
        chainId,
        dev: isDevENV
      });
      setChannelListData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testGetSubscribers = async () => {
    try {
      setLoading(true);
      const response = await EpnsAPI.channels._getSubscribers({
        channel: channelAddr,
        channelAlias: [80001, 37].includes(chainId) ? (channelData && channelData['alias_address']) : channelAddr,
        chainId,
        dev: isDevENV
      });
  
      setSubscriberData(response);
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
  };

  const testSubscriberStatus = async () => {
    try {
      setLoading(true);
      const subscriptions = await EpnsAPI.user.getSubscriptions({
        user: account,
        chainId,
        dev: isDevENV
      });

      const status = subscriptions.map((sub: any) => sub.channel).includes(channelAddr);
  
      setSubscriberStatus(status);
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false);
    }


  };

  const testOptFunctionality = async () => {
    const _signer = library.getSigner(account);

    try {
      setLoading(true);

      if (subscriberStatus) {
        await EpnsAPI.channels.unsubscribe({
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
          dev: isDevENV
        })
      } else {
        await EpnsAPI.channels.subscribe({
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
          dev: isDevENV
        })
      }

    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelData && channelData['channel']) {
      setChannelAddr(channelData['channel'])
    }
  }, [channelData])

  useEffect(() => {
    // update the other data sections as well on opt in/out completion
    if (typeof subscriberStatus === 'boolean') {
      testGetChannelByAddress();
      testGetSubscribers();
    }
  }, [subscriberStatus]);

  return (
    <div>
      <h2>Channels Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <label>Channel Address</label>
          <input type="text" onChange={updateChannelAddress} value={channelAddr} style={{ width: 400, height: 30 }} />
          <SectionButton onClick={testGetChannelByAddress}>get channel data</SectionButton>
        </SectionItem>
 
        <SectionItem>
          <div>
            {channelData ? (
              <CodeFormatter>
                {JSON.stringify(channelData, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testGetSubscribers}>get subscribers</SectionButton>
            </SectionItem>
            
            {subscriberData ? (
              <CodeFormatter>
                {JSON.stringify(subscriberData, null, 4)}
              </CodeFormatter>
            ) : null}

            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={testSubscriberStatus}>check if logged-in user is subscribed</SectionButton>
            </SectionItem>
            {typeof subscriberStatus === 'boolean' ? (
              <>
                <CodeFormatter>
                  {JSON.stringify(subscriberStatus, null, 4)}
                </CodeFormatter>

                <SectionButton onClick={testOptFunctionality}>{subscriberStatus ? 'OPT OUT' : 'OPT IN'}</SectionButton>
              </>
            ) : null}
          </div>
        </SectionItem>

        <div style={{ marginTop: 50, paddingTop: 30, borderTop: '1px solid' }}>
            <SectionItem>
              <label>Channel Name</label>
              <input type="text" onChange={updateChannelName} value={channelName} style={{ width: 400, height: 30 }} />
              <SectionButton onClick={testGetChannelByName}>get channel data</SectionButton>
            </SectionItem>

            {channelListData ? (
              <CodeFormatter>
                {JSON.stringify(channelListData, null, 4)}
              </CodeFormatter>
            ) : null}
        </div>
      </Section>
    </div>
  );
}

export default ChannelsPage;