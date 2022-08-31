import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Section, SectionItem, SectionButton } from '../../components/styled';
import Loader from '../../components/loader'
import { DarkIcon, LightIcon } from '../../components/icons';
import { APIFeedback } from '../../components/feedback';
import Web3Context, { EnvContext } from '../../context/web3Context';
import * as EpnsAPI from '@epnsproject/sdk-restapi';
import { getCAIPAddress } from '../../helpers';

const TabButtons = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ThemeSelector = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 32px;
`;

const NOTIFICATION_TYPE = {
  BROADCAST: 1,
  TARGETTED: 3,
  SUBSET: 4
};

const IDENTITY_TYPE = {
  MINIMAL: 0,
  IPFS: 1,
  DIRECT_PAYLOAD: 2,
  SUBGRAPH: 3
};

const getOptionsMatrix = (
  { signer, env = 'prod', isCAIP, channel, timestamp } :
  { signer: any, env?: string, isCAIP?: boolean, channel: string, timestamp: string }
) => {
  if (!signer) throw Error(`No Signer provided`);

  // console.log('isCAIP: ===> ', isCAIP);

  return {
    TARGETTED: {
      DIRECT_PAYLOAD:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xD8634C39BBFd4033c0d3289C4515275102423681') : '0xD8634C39BBFd4033c0d3289C4515275102423681',
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      IPFS: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.IPFS}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1') : '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      MINIMAL: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1') : '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      GRAPH: {
          signer,
          env,
          type: NOTIFICATION_TYPE.TARGETTED,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.TARGETTED} identity:${IDENTITY_TYPE.SUBGRAPH}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? getCAIPAddress(env, '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1') : '0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1',
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      }
    },
    SUBSET: {
      DIRECT_PAYLOAD:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'],
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      IPFS: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.IPFS}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'],
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      MINIMAL: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'],
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      GRAPH: {
          signer,
          env,
          type: NOTIFICATION_TYPE.SUBSET,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.SUBSET} identity:${IDENTITY_TYPE.SUBGRAPH}`,
              cta: '',
              img: ''
          },
          recipients: isCAIP ? 
            ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'].map(addr => getCAIPAddress(env, addr))
            : ['0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1', '0x52f856A160733A860ae7DC98DC71061bE33A28b3'],
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      }
    },
    BROADCAST: {
      DIRECT_PAYLOAD:  {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.DIRECT_PAYLOAD}`,
              cta: '',
              img: ''
          },
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      IPFS: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.IPFS,
          ipfsHash: 'bafkreicuttr5gpbyzyn6cyapxctlr7dk2g6fnydqxy6lps424mcjcn73we', // from BE devtools
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.IPFS}`,
              cta: '',
              img: ''
          },
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      MINIMAL: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.MINIMAL,
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.MINIMAL}`,
              cta: '',
              img: ''
          },
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      },
      GRAPH: {
          signer,
          env,
          type: NOTIFICATION_TYPE.BROADCAST,
          identityType: IDENTITY_TYPE.SUBGRAPH,
          graph: {
            id: 'aiswaryawalter/graph-poc-sample',
            counter: 3
          },
          notification: {
              title: `[SDK-TEST] notification TITLE: ${timestamp}`,
              body: `[sdk-test] notification BODY ${timestamp}`
          },
          payload: {
              title: `[sdk-test] payload title ${timestamp}`,
              body: `type:${NOTIFICATION_TYPE.BROADCAST} identity:${IDENTITY_TYPE.SUBGRAPH}`,
              cta: '',
              img: ''
          },
          channel: isCAIP ? getCAIPAddress(env, channel) : channel,
      }
    },
  };

}

const PayloadsPage = () => {
    const { library, account, chainId } = useContext<any>(Web3Context);
    const { env, isCAIP }  = useContext<any>(EnvContext);
    const [isLoading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [viewType, setViewType] = useState(IDENTITY_TYPE.DIRECT_PAYLOAD);
    const [apiStatus, setApiStatus] = useState<any>();
    const [inputOption, setInputOption] = useState<any>();
    const [OPTIONS_MATRIX, SET_OPTIONS_MATRIX] = useState<any>({});
    const [timestamp, setTimestamp] = useState<string>(JSON.stringify(Date.now()));
    
    // const PK = 'd5797b255933f72a6a084fcfc0f5f4881defee8c1ae387197805647d0b10a8a0'; // PKey, server code
    // const Pkey = `0x${PK}`;
    // const testChannelAddress = '0xD8634C39BBFd4033c0d3289C4515275102423681'; // server code
    const testChannelAddress = account; // UI 
    
  
    // for server code
    // const signer = new ethers.Wallet(Pkey);
  
    // for UI code
    const signer = library.getSigner(account);
  
  
    const toggleTheme = () => {
      setTheme(lastTheme => {
        return lastTheme === 'dark' ? 'light' : 'dark'
      })
    };
  
    const toggleIdentity = (_identity: any) => {
      setApiStatus('');
      setViewType(_identity);
    };
  
    const triggerNotification = async () => {
      setApiStatus('');
      setLoading(true);
      try {
        console.log('inputOption: ', inputOption);
    
        const apiResponse = await EpnsAPI.payloads.sendNotification(inputOption);
        console.log('apiResponse: ', apiResponse);
        setApiStatus({
          status: apiResponse?.status,
          data: apiResponse?.config?.data
        });
      } catch (e) {
        console.error('sendNotification error: \n', e);
        setApiStatus(JSON.stringify(e));
      } finally {
        setLoading(false);
      }
    };
  
  
    const selectInputOption = (_option: any) => {
      setTimestamp(JSON.stringify(Date.now()));
      setInputOption(_option);
    };
  
    const renderSections = () => {
      if (viewType === IDENTITY_TYPE.MINIMAL) {
        return (
          <>
            <b className='headerText'>MINIMAL: </b>
            <SectionItem>
              {/* <CodeFormatter>  
                {JSON.stringify(OPTIONS_MATRIX.TARGETTED.MINIMAL, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="MINIMAL"
                  value="TARGETTED"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.TARGETTED.MINIMAL)}
                />
                TARGETTED
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.SUBSET.MINIMAL, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="MINIMAL"
                  value="SUBSET"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.SUBSET.MINIMAL)}
                />
                SUBSET
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.BROADCAST.MINIMAL, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="MINIMAL"
                  value="BROADCAST"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.BROADCAST.MINIMAL)}
                />
                BROADCAST
              </label>
            </SectionItem>
          </>
        );
      }
  
      if (viewType === IDENTITY_TYPE.IPFS) {
        return (
          <>
            <b className='headerText'>IPFS: </b>
            <SectionItem>
              {/* <CodeFormatter>  
                {JSON.stringify(OPTIONS_MATRIX.TARGETTED.IPFS, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="IPFS"
                  value="TARGETTED"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.TARGETTED.IPFS)}
                />
                TARGETTED
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.SUBSET.IPFS, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="IPFS"
                  value="SUBSET"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.SUBSET.IPFS)}
                />
                SUBSET
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.BROADCAST.IPFS, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="IPFS"
                  value="BROADCAST"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.BROADCAST.IPFS)}
                />
                BROADCAST
              </label>
            </SectionItem>
          </>
        );
      }
  
      if (viewType === IDENTITY_TYPE.SUBGRAPH) {
        return (
          <>
            <b className='headerText'>GRAPH: (make sure the account connected has the associated graph ID)</b>
            <SectionItem>
              {/* <CodeFormatter>  
                {JSON.stringify(OPTIONS_MATRIX.TARGETTED.GRAPH, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="GRAPH"
                  value="TARGETTED"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.TARGETTED.GRAPH)}
                />
                TARGETTED
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.SUBSET.GRAPH, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="GRAPH"
                  value="SUBSET"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.SUBSET.GRAPH)}
                />
                SUBSET
              </label>
            </SectionItem>
    
            <SectionItem>
              {/* <CodeFormatter>
                {JSON.stringify(OPTIONS_MATRIX.BROADCAST.GRAPH, null, 4)}
              </CodeFormatter> */}
              <label className='consoleLabel'>
                <input
                  type="radio"
                  name="GRAPH"
                  value="BROADCAST"
                  onChange={() => selectInputOption(OPTIONS_MATRIX.BROADCAST.GRAPH)}
                />
                BROADCAST
              </label>
            </SectionItem>
          </>
        );
      }
  
      return (
        <>
          <b className='headerText'>DIRECT_PAYLOAD: </b>
          <SectionItem>
            {/* <CodeFormatter>  
              {JSON.stringify(OPTIONS_MATRIX.TARGETTED.DIRECT_PAYLOAD, null, 4)}
            </CodeFormatter> */}
            <label className='consoleLabel'>
              <input
                type="radio"
                name="DIRECT_PAYLOAD"
                value="TARGETTED"
                onChange={() => selectInputOption(OPTIONS_MATRIX.TARGETTED.DIRECT_PAYLOAD)}
              />
              TARGETTED
            </label>
          </SectionItem>
  
          <SectionItem>
            {/* <CodeFormatter>
              {JSON.stringify(OPTIONS_MATRIX.SUBSET.DIRECT_PAYLOAD, null, 4)}
            </CodeFormatter> */}
            <label className='consoleLabel'>
              <input
                type="radio"
                name="DIRECT_PAYLOAD"
                value="SUBSET"
                onChange={() => selectInputOption(OPTIONS_MATRIX.SUBSET.DIRECT_PAYLOAD)}
              />
              SUBSET
            </label>
          </SectionItem>
  
          <SectionItem>
            {/* <CodeFormatter>
              {JSON.stringify(OPTIONS_MATRIX.BROADCAST.DIRECT_PAYLOAD, null, 4)}
            </CodeFormatter> */}
            <label className='consoleLabel'>
              <input
                type="radio"
                name="DIRECT_PAYLOAD"
                value="BROADCAST"
                onChange={() => selectInputOption(OPTIONS_MATRIX.BROADCAST.DIRECT_PAYLOAD)}
              />
              BROADCAST
            </label>
          </SectionItem>
        </>
      );
    };
  
    useEffect(() => {
      const options = getOptionsMatrix({
        signer,
        channel: testChannelAddress,
        env,
        isCAIP,
        timestamp
      });
  
      SET_OPTIONS_MATRIX(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [env, isCAIP, timestamp]);
  
    // console.log('LOG: --> ', { env, isCAIP });
  
    useEffect(() => {
      localStorage.setItem('_dump_', JSON.stringify([]));
    }, []);
  
    return (
        <div>
          <Header>
            <h2>Payloads Test page</h2>
            <ThemeSelector>
              {theme === 'dark' ? <DarkIcon title="Dark" onClick={toggleTheme}/> : <LightIcon title="Light" onClick={toggleTheme}/>}
            </ThemeSelector>
          </Header>
  
          <p>IMPORTANT: Will only work if the channel address you are providing exists in the ENV you are running the app!!</p>
                  
          <TabButtons>
            <SectionButton onClick={() => { toggleIdentity(IDENTITY_TYPE.DIRECT_PAYLOAD) }}>DIRECT PAYLOAD</SectionButton>
            <SectionButton onClick={() => { toggleIdentity(IDENTITY_TYPE.MINIMAL) }}>MINIMAL</SectionButton> 
            <SectionButton onClick={() => { toggleIdentity(IDENTITY_TYPE.IPFS) }}>IPFS</SectionButton>
            <SectionButton onClick={() => { toggleIdentity(IDENTITY_TYPE.SUBGRAPH) }}>SUBGRAPH</SectionButton>
          </TabButtons>
  
          <Loader show={isLoading} />
  
         
          <Section theme={theme}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 16 }}>
              <p style={{ color: '#b57f38' }}>Please choose one of the options below and hit "send notification" button</p>
              <p style={{ color: '#b57f38' }}>{timestamp}</p>
              <SectionButton style={{ width: 400 }} onClick={() => triggerNotification()}>send notification</SectionButton>
              {apiStatus ? <APIFeedback status={apiStatus?.status === 204 ? 'success' : 'error'}>{JSON.stringify(apiStatus)}</APIFeedback> : null}
            </div>
  
            {renderSections()}
          </Section>
  
  
        </div>
    );
}

export default PayloadsPage;