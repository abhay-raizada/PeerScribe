import {SimplePool} from 'nostr-tools';
import {V1FormSpec} from '@formstr/sdk/dist/interfaces';

const defaultRelays = ['wss://relay.primal.net/', 'wss://relay.hllo.live'];

export const getFormTemplate = async (formId: string): Promise<{}> => {
  console.log('inside getFormTemplate');
  const pool = new SimplePool();
  let formIdPubkey = formId;
  let relayList = defaultRelays;
  console.log('everything initialised');
  const filter = {
    kinds: [0],
    authors: [formIdPubkey], //formId is the npub of the form
  };
  console.log('getting kind0', filter);
  pool
    .get(relayList, filter, {maxWait: 10})
    .then(
      value => {
        console.log('got kind0', value);
        return;
      },
      reason => {
        console.log('failed to get because', reason);
        return;
      },
    )
    .catch(reason => {
      console.log('Errored', reason);
      return;
    });
  console.log('after promise');

  try {
    console.log('inside try');
    console.log(
      'Event',
      await pool.querySync(relayList, filter, {maxWait: 10}),
    );
    // console.log('fetching...', fetch('https://github.com'));
    console.log('Main thread is stuck');
  } catch (e) {
    console.log('inside catch');
    console.log('error is', e);
  }

  console.log('After everything');

  pool.close(relayList);
  let formTemplate;
  // if (kind0) {
  //   formTemplate = JSON.parse(kind0.content);
  // } else {
  //   throw Error('Form template not found');
  // }
  return {};
};
