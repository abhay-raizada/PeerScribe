import {SimplePool} from 'nostr-tools';
import {V1FormSpec} from '@formstr/sdk/dist/interfaces';

const relayList = ['wss://relay.primal.net/', 'wss://relay.hllo.live/'];

export const getFormTemplate = async (formId: string): Promise<{}> => {
  console.log('inside getFormTemplate');
  const pool = new SimplePool();
  let formIdPubkey = formId;
  console.log('everything initialised');
  const filter = {
    kinds: [0],
    authors: [formIdPubkey], //formId is the npub of the form
  };
  let kind0 = null
  try {
    console.log('inside trydasdsad');
    kind0 = await pool.get(relayList, filter)
    console.log('Main thread is working, got event', kind0);
  } catch (e) {
    console.log('inside catch');
    console.log('error is', e);
  }

  pool.close(relayList);
  let formTemplate;
  if (kind0) {
    formTemplate = JSON.parse(kind0.content);
  } else {
    throw Error('Form template not found');
  }
  return formTemplate;
};
